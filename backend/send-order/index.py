import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import urllib.request

ADMIN_ORDERS_URL = "https://functions.poehali.dev/010513ea-3143-4cc6-9e47-d5722ea1790b"

def send_telegram(token: str, chat_id: str, text: str):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read())

def handler(event: dict, context) -> dict:
    """Сохранение заказа в БД, отправка письма и уведомления в Telegram владельцу"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')

    delivery_in = body.get('name', '')
    phone = body.get('phone', '')
    street = body.get('street', '')
    house = body.get('house', '')
    entrance = body.get('entrance', '')
    apartment = body.get('apartment', '')
    floor = body.get('floor', '')
    intercom = body.get('intercom', '')
    comment = body.get('comment', '')
    items = body.get('items', [])
    total = body.get('total', 0)
    delivery_cost = body.get('delivery_cost', 0)
    payment_method = body.get('payment_method', '')

    items_text = '\n'.join([f"  • {item['name']} — {item['qty']} × {item['price']} ₽ = {item['sum']} ₽" for item in items])
    address = f"ул. {street}, д. {house}" + (f", подъезд {entrance}" if entrance else '') + (f", кв. {apartment}" if apartment else '') + (f", этаж {floor}" if floor else '') + (f", домофон {intercom}" if intercom else '')
    message = f"Доставить через: {delivery_in}\nАдрес: {address}\nСостав:\n{items_text}\nИтого: {total} ₽\nДоставка: {delivery_cost} ₽\nОплата: {payment_method}\nКомментарий: {comment or '—'}"

    order_id = 0
    try:
        save_data = json.dumps({'name': delivery_in, 'phone': phone, 'message': message}).encode('utf-8')
        req = urllib.request.Request(ADMIN_ORDERS_URL, data=save_data, headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(req, timeout=5) as resp:
            result = json.loads(resp.read())
            order_id = result.get('id', 0)
    except Exception:
        pass

    tg_text = f"""🛒 <b>НОВЫЙ ЗАКАЗ #{order_id}</b>

📞 Телефон: {phone}
💳 Оплата: {payment_method}

📦 <b>Состав заказа:</b>
{items_text}

🚚 Доставка: {'Бесплатно' if delivery_cost == 0 else f'{delivery_cost} ₽'}
💰 <b>Итого: {total} ₽</b>

🏠 <b>Адрес:</b>
{address}

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
    msg['Subject'] = f'Заказ #{order_id} на {total} ₽ — {payment_method}'
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