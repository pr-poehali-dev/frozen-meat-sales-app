import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = "t_p10284751_frozen_meat_sales_ap"

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

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
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'session_id': session_id})}
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Неверный логин или пароль'})}

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
            password = body.get('password', '')
            if not phone or not name or not password:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Заполните все поля'})}
            pw_hash = hash_password(password)
            conn = get_conn(); cur = conn.cursor()
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE phone = %s", (phone,))
            if cur.fetchone():
                cur.close(); conn.close()
                return {'statusCode': 409, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Номер уже зарегистрирован'})}
            cur.execute(f"INSERT INTO {SCHEMA}.users (phone, name, password_hash) VALUES (%s, %s, %s) RETURNING id", (phone, name, pw_hash))
            user_id = cur.fetchone()[0]
            session_id = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.user_sessions (session_id, user_id) VALUES (%s, %s)", (session_id, user_id))
            conn.commit()
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

    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not found'})}
