import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def handler(event: dict, context) -> dict:
    """Отправка заказа с адресом доставки на почту владельца"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')

    name = body.get('name', '')
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

    text = f"""🛒 НОВЫЙ ЗАКАЗ

⏱ Доставить через: {name}
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
    msg['Subject'] = f'Новый заказ на {total} ₽ (доставка через {name})'
    msg.attach(MIMEText(text, 'plain', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }