import json
import os
import hashlib
import secrets
import psycopg2
import urllib.request
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

SCHEMA = "t_p10284751_frozen_meat_sales_ap"

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def send_email(to: str, subject: str, body: str):
    smtp_password = os.environ.get('YANDEX_SMTP_PASSWORD', '')
    if not smtp_password:
        return
    msg = MIMEText(body, 'plain', 'utf-8')
    msg['Subject'] = subject
    msg['From'] = 'yupomosh@yandex.ru'
    msg['To'] = to
    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login('yupomosh@yandex.ru', smtp_password)
        server.sendmail('yupomosh@yandex.ru', [to], msg.as_string())

def send_telegram(token: str, chat_id: str, text: str):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read())

def handler(event: dict, context) -> dict:
    """Авторизация администратора и покупателей. role=admin|user, action=login|register|check|logout"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id, X-User-Session'}, 'body': ''}

    method = event.get('httpMethod')
    params = event.get('queryStringParameters') or {}
    role = params.get('role', 'admin')
    action = params.get('action', '')
    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    # ─── ADMIN AUTH ───────────────────────────────────────────────

    if role == 'admin':
        if method == 'GET' and action == 'check':
            session_id = event.get('headers', {}).get('X-Session-Id', '')
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT admin_id FROM {SCHEMA}.admin_sessions WHERE session_id = %s", (session_id,))
            row = cur.fetchone()
            cur.close(); conn.close()
            if row:
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False})}

        if method == 'POST' and action == 'login':
            body = json.loads(event.get('body') or '{}')
            login = body.get('login', '')
            password = body.get('password', '')
            password_hash = hashlib.md5(password.encode()).hexdigest()
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT id FROM {SCHEMA}.admin_users WHERE login = %s AND password_hash = %s", (login, password_hash))
            row = cur.fetchone()
            if row:
                session_id = secrets.token_hex(32)
                cur.execute(f"INSERT INTO {SCHEMA}.admin_sessions (session_id, admin_id, login) VALUES (%s, %s, %s)", (session_id, row[0], login))
                conn.commit()
                cur.close(); conn.close()
                ip = (event.get('requestContext') or {}).get('identity', {}).get('sourceIp', '—')
                now = datetime.now().strftime('%d.%m.%Y %H:%M')
                tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
                tg_chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
                if tg_token and tg_chat_id:
                    try:
                        send_telegram(tg_token, tg_chat_id, f"🔐 <b>Вход в админку</b>\n🕐 {now}\n👤 Логин: {login}\n🌐 IP: {ip}")
                    except Exception as e:
                        print(f"TG error: {e}")
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'session_id': session_id})}
            ip = (event.get('requestContext') or {}).get('identity', {}).get('sourceIp', '—')
            now = datetime.now().strftime('%d.%m.%Y %H:%M')
            tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
            tg_chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
            if tg_token and tg_chat_id:
                try:
                    send_telegram(tg_token, tg_chat_id, f"⚠️ <b>Неверный пароль в админку!</b>\n🕐 {now}\n👤 Логин: {login}\n🌐 IP: {ip}")
                except Exception as e:
                    print(f"TG error: {e}")
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Неверный логин или пароль'})}

        # Смена пароля админа
        if method == 'POST' and action == 'change_password':
            session_id = event.get('headers', {}).get('X-Session-Id', '')
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT admin_id FROM {SCHEMA}.admin_sessions WHERE session_id = %s", (session_id,))
            row = cur.fetchone()
            if not row:
                cur.close(); conn.close()
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Не авторизован'})}
            admin_id = row[0]
            body = json.loads(event.get('body') or '{}')
            old_password = body.get('old_password', '')
            new_password = body.get('new_password', '')
            if not old_password or not new_password:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Заполните все поля'})}
            old_hash = hashlib.md5(old_password.encode()).hexdigest()
            cur.execute(f"SELECT id FROM {SCHEMA}.admin_users WHERE id = %s AND password_hash = %s", (admin_id, old_hash))
            if not cur.fetchone():
                cur.close(); conn.close()
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Неверный текущий пароль'})}
            new_hash = hashlib.md5(new_password.encode()).hexdigest()
            cur.execute(f"UPDATE {SCHEMA}.admin_users SET password_hash = %s WHERE id = %s", (new_hash, admin_id))
            conn.commit()
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        if method == 'POST' and action == 'forgot_password':
            body = json.loads(event.get('body') or '{}')
            login_val = body.get('login', '').strip()
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT id, email FROM {SCHEMA}.admin_users WHERE login = %s", (login_val,))
            row = cur.fetchone()
            if row:
                admin_id, email = row
                tmp_password = secrets.token_urlsafe(8)
                tmp_hash = hashlib.md5(tmp_password.encode()).hexdigest()
                cur.execute(f"UPDATE {SCHEMA}.admin_users SET password_hash = %s WHERE id = %s", (tmp_hash, admin_id))
                conn.commit()
                if email:
                    try:
                        send_email(email, 'Временный пароль — Фабрикант Юрко',
                            f'Ваш временный пароль для входа в административную панель:\n\n{tmp_password}\n\nПосле входа смените пароль в настройках.')
                    except Exception as e:
                        print(f"Email error: {e}")
                ip = (event.get('requestContext') or {}).get('identity', {}).get('sourceIp', '—')
                now = datetime.now().strftime('%d.%m.%Y %H:%M')
                tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
                tg_chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
                if tg_token and tg_chat_id:
                    try:
                        send_telegram(tg_token, tg_chat_id, f"🔑 <b>Запрос сброса пароля</b>\n🕐 {now}\n👤 Логин: {login_val}\n🌐 IP: {ip}\n📧 Временный пароль отправлен на почту")
                    except Exception as e:
                        print(f"TG error: {e}")
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        if method == 'DELETE' and action == 'logout':
            session_id = event.get('headers', {}).get('X-Session-Id', '')
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"DELETE FROM {SCHEMA}.admin_sessions WHERE session_id = %s", (session_id,))
            conn.commit()
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        if method == 'GET' and action == 'user_stats':
            session_id = event.get('headers', {}).get('X-Session-Id', '')
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT admin_id FROM {SCHEMA}.admin_sessions WHERE session_id = %s", (session_id,))
            if not cur.fetchone():
                cur.close(); conn.close()
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False})}
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users")
            total = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users WHERE created_at >= CURRENT_DATE")
            today = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'")
            week = cur.fetchone()[0]
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'total': total, 'today': today, 'week': week})}

    # ─── USER AUTH ────────────────────────────────────────────────

    if role == 'user':
        if method == 'POST' and action == 'register':
            body = json.loads(event.get('body') or '{}')
            phone = body.get('phone', '').strip()
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            if not phone or not name or not password or not email:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Заполните все поля'})}
            pw_hash = hash_password(password)
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE phone = %s", (phone,))
            if cur.fetchone():
                cur.close(); conn.close()
                return {'statusCode': 409, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Номер уже зарегистрирован'})}
            cur.execute(f"INSERT INTO {SCHEMA}.users (phone, name, password_hash, email) VALUES (%s, %s, %s, %s) RETURNING id", (phone, name, pw_hash, email))
            user_id = cur.fetchone()[0]
            session_id = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.user_sessions (session_id, user_id) VALUES (%s, %s)", (session_id, user_id))
            conn.commit()
            now = datetime.now().strftime('%d.%m.%Y %H:%M')
            tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
            tg_chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
            if tg_token and tg_chat_id:
                try:
                    send_telegram(tg_token, tg_chat_id, f"🎉 <b>Новый покупатель!</b>\n🕐 {now}\n👤 {name}\n📞 {phone}\n📧 {email or '—'}")
                except Exception as e:
                    print(f"TG error: {e}")
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'session_id': session_id, 'user_id': user_id, 'name': name, 'phone': phone})}

        if method == 'POST' and action == 'login':
            body = json.loads(event.get('body') or '{}')
            phone = body.get('phone', '').strip()
            password = body.get('password', '')
            pw_hash = hash_password(password)
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT id, name FROM {SCHEMA}.users WHERE phone = %s AND password_hash = %s", (phone, pw_hash))
            row = cur.fetchone()
            if not row:
                cur.close(); conn.close()
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Неверный номер или пароль'})}
            user_id, name = row
            session_id = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.user_sessions (session_id, user_id) VALUES (%s, %s)", (session_id, user_id))
            conn.commit()
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'session_id': session_id, 'user_id': user_id, 'name': name, 'phone': phone})}

        if method == 'GET' and action == 'check':
            session_id = event.get('headers', {}).get('X-User-Session', '')
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT u.id, u.name, u.phone FROM {SCHEMA}.user_sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id WHERE s.session_id = %s", (session_id,))
            row = cur.fetchone()
            cur.close(); conn.close()
            if row:
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'user_id': row[0], 'name': row[1], 'phone': row[2]})}
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False})}

        if method == 'DELETE' and action == 'logout':
            session_id = event.get('headers', {}).get('X-User-Session', '')
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"DELETE FROM {SCHEMA}.user_sessions WHERE session_id = %s", (session_id,))
            conn.commit()
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        # Восстановление пароля — отправка временного пароля на email
        if method == 'POST' and action == 'reset_password':
            body = json.loads(event.get('body') or '{}')
            phone = body.get('phone', '').strip()
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT id, name, email FROM {SCHEMA}.users WHERE phone = %s", (phone,))
            row = cur.fetchone()
            if not row:
                cur.close(); conn.close()
                return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Номер не найден'})}
            user_id, name, email = row
            if not email:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Email не указан при регистрации'})}
            tmp_password = secrets.token_urlsafe(8)
            new_hash = hash_password(tmp_password)
            cur.execute(f"UPDATE {SCHEMA}.users SET password_hash = %s WHERE id = %s", (new_hash, user_id))
            conn.commit()
            cur.close(); conn.close()
            smtp_password = os.environ.get('YANDEX_SMTP_PASSWORD', '')
            if smtp_password:
                import smtplib
                from email.mime.text import MIMEText
                from email.mime.multipart import MIMEMultipart
                sender = 'yupomosh@yandex.ru'
                msg = MIMEMultipart()
                msg['From'] = sender
                msg['To'] = email
                msg['Subject'] = 'Восстановление пароля — ФАБРИКАНТ ЮРКО'
                text = f"Привет, {name}!\n\nВаш временный пароль: {tmp_password}\n\nВойдите на сайт и смените пароль в личном кабинете.\n\nС уважением,\nФАБРИКАНТ ЮРКО"
                msg.attach(MIMEText(text, 'plain', 'utf-8'))
                try:
                    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
                        server.login(sender, smtp_password)
                        server.sendmail(sender, email, msg.as_string())
                except Exception as e:
                    print(f"Email ERROR: {e}")
            masked = email[:2] + '***' + email[email.find('@'):]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'masked_email': masked})}

        # Смена пароля пользователем
        if method == 'POST' and action == 'change_password':
            session_id = event.get('headers', {}).get('X-User-Session', '')
            body = json.loads(event.get('body') or '{}')
            old_password = body.get('old_password', '')
            new_password = body.get('new_password', '')
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT u.id FROM {SCHEMA}.user_sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id WHERE s.session_id = %s AND u.password_hash = %s", (session_id, hash_password(old_password)))
            row = cur.fetchone()
            if not row:
                cur.close(); conn.close()
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Неверный текущий пароль'})}
            cur.execute(f"UPDATE {SCHEMA}.users SET password_hash = %s WHERE id = %s", (hash_password(new_password), row[0]))
            conn.commit()
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not found'})}