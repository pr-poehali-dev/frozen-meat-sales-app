import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import urllib.request
import urllib.error
import psycopg2
import uuid
import base64
from datetime import datetime

SCHEMA = "t_p10284751_frozen_meat_sales_ap"
ADMIN_ORDERS_URL = "https://functions.poehali.dev/010513ea-3143-4cc6-9e47-d5722ea1790b"
YUKASSA_SHOP_ID = "1339557"

def yukassa_request(method: str, path: str, data: dict = None) -> dict:
    secret_key = os.environ.get('YUKASSA_SECRET_KEY', '')
    credentials = base64.b64encode(f"{YUKASSA_SHOP_ID}:{secret_key}".encode()).decode()
    url = f"https://api.yookassa.ru/v3/{path}"
    headers = {
        'Authorization': f'Basic {credentials}',
        'Content-Type': 'application/json',
        'Idempotence-Key': str(uuid.uuid4())
    }
    body_bytes = json.dumps(data, ensure_ascii=False).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body_bytes, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read())

def send_telegram(token: str, chat_id: str, text: str):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read())

def send_email(subject: str, text: str, smtp_password: str):
    sender = 'yupomosh@yandex.ru'
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = sender
    msg['Subject'] = subject
    msg.attach(MIMEText(text, 'plain', 'utf-8'))
    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, sender, msg.as_string())

def handler(event: dict, context) -> dict:
    """Сохранение заказа, отмена заказа, ЮКасса оплата"""
    CORS_HEADERS = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-User-Session', 'Access-Control-Max-Age': '86400'}

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    body = json.loads(event.get('body') or '{}')

    # Проверка статуса платежа ЮКасса
    if event.get('httpMethod') == 'GET' and params.get('action') == 'payment_status':
        payment_id = params.get('payment_id', '')
        order_id = params.get('order_id', 0)
        result = yukassa_request('GET', f'payments/{payment_id}')
        status = result.get('status')
        if status == 'succeeded' and order_id:
            try:
                conn = psycopg2.connect(os.environ['DATABASE_URL'])
                cur = conn.cursor()
                cur.execute(f"UPDATE {SCHEMA}.orders SET status='in_progress' WHERE id=%s AND status='new'", (order_id,))
                conn.commit()
                cur.close()
                conn.close()
            except Exception as e:
                print(f"DB update ERROR: {e}")
        return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True, 'status': status, 'paid': status == 'succeeded'})}

    # Создание платежа ЮКасса
    if event.get('httpMethod') == 'POST' and body.get('type') == 'create_payment':
        amount = body.get('amount', 0)
        order_id = body.get('order_id', 0)
        description = body.get('description', 'Заказ — Фабрикант Юрко')
        return_url = f"https://фабрикант-ирко-рф.shop/?order_id={order_id}&paid=1"
        payment_data = {
            'amount': {'value': f"{float(amount):.2f}", 'currency': 'RUB'},
            'confirmation': {'type': 'redirect', 'return_url': return_url},
            'capture': True,
            'description': description,
            'metadata': {'order_id': str(order_id)}
        }
        result = yukassa_request('POST', 'payments', payment_data)
        return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps({
            'ok': True,
            'payment_id': result.get('id', ''),
            'confirmation_url': result.get('confirmation', {}).get('confirmation_url', '')
        })}

    # Обратная связь
    if event.get('httpMethod') == 'POST' and body.get('type') == 'contact':
        name = body.get('name', '')
        phone = body.get('phone', '')
        email = body.get('email', '')
        message = body.get('message', '')
        now = datetime.now().strftime('%d.%m.%Y %H:%M')

        tg_text = f"""💬 <b>ОБРАТНАЯ СВЯЗЬ</b>
🕐 {now}

👤 Имя: {name}
📞 Телефон: {phone}
📧 Email: {email or '—'}

📝 Сообщение: {message or '—'}"""

        tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
        tg_chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
        if tg_token and tg_chat_id:
            try:
                send_telegram(tg_token, tg_chat_id, tg_text)
            except Exception as e:
                print(f"Telegram ERROR: {e}")

        smtp_password = os.environ.get('YANDEX_SMTP_PASSWORD', '')
        if smtp_password:
            try:
                sender = 'yupomosh@yandex.ru'
                msg = MIMEMultipart()
                msg['From'] = sender
                msg['To'] = sender
                msg['Subject'] = f'Обратная связь от {name} — {phone}'
                msg.attach(MIMEText(tg_text.replace('<b>', '').replace('</b>', ''), 'plain', 'utf-8'))
                with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
                    server.login(sender, smtp_password)
                    server.sendmail(sender, sender, msg.as_string())
            except Exception as e:
                print(f"Email ERROR: {e}")

        return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True})}

    # Отмена заказа покупателем
    if event.get('httpMethod') == 'PUT':
        order_id = body.get('order_id', 0)
        name = body.get('name', '')
        phone = body.get('phone', '')
        now = datetime.now().strftime('%d.%m.%Y %H:%M')

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.orders SET status='cancelled' WHERE id=%s", (order_id,))
        conn.commit()
        cur.close()
        conn.close()

        tg_text = f"❌ <b>ОТМЕНА ЗАКАЗА #{order_id}</b>\n🕐 {now}\n👤 {name}\n📞 {phone}"
        tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
        tg_chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
        if tg_token and tg_chat_id:
            try:
                send_telegram(tg_token, tg_chat_id, tg_text)
            except Exception as e:
                print(f"Telegram ERROR: {e}")

        smtp_password = os.environ.get('YANDEX_SMTP_PASSWORD', '')
        if smtp_password:
            try:
                send_email(
                    f'❌ Отмена заказа #{order_id} — {name} {phone}',
                    f"Заказ #{order_id} отменён покупателем.\nИмя: {name}\nТелефон: {phone}\nВремя: {now}",
                    smtp_password
                )
            except Exception as e:
                print(f"Email ERROR: {e}")

        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

    name = body.get('name', '')
    phone = body.get('phone', '')
    street = body.get('street', '')
    house = body.get('house', '')
    entrance = body.get('entrance', '')
    apartment = body.get('apartment', '')
    floor = body.get('floor', '')
    intercom = body.get('intercom', '')
    comment = body.get('comment', '')
    district = body.get('district', '')
    items = body.get('items', [])
    total = body.get('total', 0)
    delivery_cost = body.get('delivery_cost', 0)
    payment_method = body.get('payment_method', '')
    delivery_minutes = body.get('delivery_minutes', 45)
    arrival_time = body.get('arrival_time', '')
    is_evening = body.get('is_evening', False)
    discount_percent = body.get('discount_percent', 0)
    discount_amount = body.get('discount_amount', 0)
    order_count = body.get('order_count', 0)

    now = datetime.now()
    order_time = now.strftime('%d.%m.%Y %H:%M')

    preorder_items = [item for item in items if not item.get('inStock', True)]

    def item_line(item):
        line = f"  • {item['name']} — {item['qty']} × {item['price']} ₽ = {item['sum']} ₽"
        if not item.get('inStock', True):
            d = item.get('availableDate', '')
            line += f" [ПОД ЗАКАЗ{' — с ' + d if d else ''}]"
        return line

    items_text = '\n'.join([item_line(i) for i in items])
    address = f"ул. {street}, д. {house}" + (f", подъезд {entrance}" if entrance else '') + (f", кв. {apartment}" if apartment else '') + (f", этаж {floor}" if floor else '') + (f", домофон {intercom}" if intercom else '')
    message = f"Имя: {name}\nРайон: {district}\nАдрес: {address}\nСостав:\n{items_text}\nИтого: {total} ₽\nДоставка: {delivery_cost} ₽\nОплата: {payment_method}\nКомментарий: {comment or '—'}"

    # Получаем user_id по сессии если пользователь авторизован
    user_session = event.get('headers', {}).get('X-User-Session', '')
    user_id = None
    if user_session:
        try:
            conn_u = psycopg2.connect(os.environ['DATABASE_URL'])
            cur_u = conn_u.cursor()
            cur_u.execute(f"SELECT user_id FROM {SCHEMA}.user_sessions WHERE session_id = %s", (user_session,))
            row_u = cur_u.fetchone()
            if row_u:
                user_id = row_u[0]
            cur_u.close()
            conn_u.close()
        except Exception:
            pass

    order_id = 0
    try:
        conn_o = psycopg2.connect(os.environ['DATABASE_URL'])
        cur_o = conn_o.cursor()
        import json as _json
        items_json = _json.dumps(items, ensure_ascii=False)
        cur_o.execute(
            f"INSERT INTO {SCHEMA}.orders (name, phone, message, items, total, delivery_cost, user_id) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (name, phone, message, items_json, total, delivery_cost, user_id)
        )
        order_id = cur_o.fetchone()[0]
        conn_o.commit()
        cur_o.close()
        conn_o.close()
    except Exception as e:
        print(f"DB save ERROR: {e}")
        try:
            save_data = json.dumps({'name': name, 'phone': phone, 'message': message}).encode('utf-8')
            req = urllib.request.Request(ADMIN_ORDERS_URL, data=save_data, headers={'Content-Type': 'application/json'}, method='POST')
            with urllib.request.urlopen(req, timeout=5) as resp:
                result = json.loads(resp.read())
                order_id = result.get('id', 0)
        except Exception:
            pass

    preorder_warning = ''
    if preorder_items:
        dates_list = list(set([f"с {i['availableDate']}" for i in preorder_items if i.get('availableDate')]))
        dates = ', '.join(dates_list) if dates_list else 'дата не указана'
        names = '\n'.join([f"  • {i['name']}" for i in preorder_items])
        preorder_warning = f"\n\n⚠️ <b>ВНИМАНИЕ: ТОВАРЫ ПОД ЗАКАЗ ({dates})</b>\n{names}"

    tg_text = f"""🛒 <b>НОВЫЙ ЗАКАЗ #{order_id}</b>
🕐 Время заказа: {order_time}{preorder_warning}

👤 Имя: {name}
📞 Телефон: {phone}
💳 Оплата: {payment_method}

📦 <b>Состав заказа:</b>
{items_text}

🚚 Доставка: {'Бесплатно' if delivery_cost == 0 else f'{delivery_cost} ₽'}{' (вечерний тариф)' if is_evening else ''}{f'{chr(10)}🎁 Скидка постоянного клиента {discount_percent}% (заказ #{order_count}): −{discount_amount} ₽' if discount_percent > 0 else ''}
💰 <b>Итого: {total} ₽</b>

🏠 <b>Адрес ({district} район):</b>
{address}

⏰ <b>Привезти к: {arrival_time} (через {delivery_minutes} мин)</b>

💬 Комментарий: {comment or '—'}"""

    tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    tg_chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
    if tg_token and tg_chat_id:
        try:
            result = send_telegram(tg_token, tg_chat_id, tg_text)
            print(f"Telegram OK: {result}")
        except Exception as e:
            print(f"Telegram ERROR: {e}")

    email_text = tg_text.replace('<b>', '').replace('</b>', '')
    smtp_password = os.environ.get('YANDEX_SMTP_PASSWORD', '')
    sender = 'yupomosh@yandex.ru'
    recipient = 'yupomosh@yandex.ru'

    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = recipient
    msg['Subject'] = f'Заказ #{order_id} на {total} ₽ — {payment_method} — к {arrival_time}'
    msg.attach(MIMEText(email_text, 'plain', 'utf-8'))

    try:
        with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
            server.login(sender, smtp_password)
            server.sendmail(sender, recipient, msg.as_string())
        print("Email OK")
    except Exception as e:
        print(f"Email ERROR: {e}")

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'order_id': order_id})
    }