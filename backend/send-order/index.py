import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import urllib.request

ADMIN_ORDERS_URL = "https://functions.poehali.dev/010513ea-3143-4cc6-9e47-d5722ea1790b"

def handler(event: dict, context) -> dict:
    """Сохранение заказа в БД и отправка письма владельцу"""
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

    items_text = '\n'.join([f"  • {item['name']} — {item['qty']} × {item['price']} ₽ = {item['sum']} ₽" for item in items])
    address = f"ул. {street}, д. {house}" + (f", подъезд {entrance}" if entrance else '') + (f", кв. {apartment}" if apartment else '') + (f", этаж {floor}" if floor else '') + (f", домофон {intercom}" if intercom else '')
    message = f"Доставить через: {delivery_in}\nАдрес: {address}\nСостав:\n{items_text}\nИтого: {total} ₽\nКомментарий: {comment or '—'}"

    order_id = 0
    try:
        save_data = json.dumps({'name': delivery_in, 'phone': phone, 'message': message}).encode('utf-8')
        req = urllib.request.Request(ADMIN_ORDERS_URL, data=save_data, headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(req, timeout=5) as resp:
            result = json.loads(resp.read())
            order_id = result.get('id', 0)
    except Exception:
        pass

    text = f"""🛒 НОВЫЙ ЗАКАЗ #{order_id}

⏱ Доставить через: {delivery_in}
📞 Телефон: {phone}

📦 Состав заказа:
{items_text}

💰 Итого: {total} ₽

🏠 Адрес доставки:
{address}

💬 Комментарий курьеру: {comment or '—'}
"""

    smtp_password = os.environ.get('YANDEX_SMTP_PASSWORD', '')
    sender = 'yupomosh@yandex.ru'
    recipient = 'yupomosh@yandex.ru'

    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = recipient
    msg['Subject'] = f'Заказ #{order_id} на {total} ₽ (доставка через {delivery_in})'
    msg.attach(MIMEText(text, 'plain', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'order_id': order_id})
    }
