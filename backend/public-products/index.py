import json
import os
import psycopg2

SCHEMA = "t_p10284751_frozen_meat_sales_ap"

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
}

def handler(event: dict, context) -> dict:
    """Публичный список товаров и статус сайта"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # Проверка статуса сайта
    cur.execute(f"SELECT value FROM {SCHEMA}.settings WHERE key='site_closed'")
    row = cur.fetchone()
    site_closed = row and row[0] == 'true'

    if site_closed:
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'site_closed': True, 'products': []}, ensure_ascii=False)}

    cur.execute(f"""
        SELECT id, name, category, description, price, price_unit, badge, img_url, in_stock, available_date
        FROM {SCHEMA}.products
        WHERE is_active = true
        ORDER BY sort_order, id
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    products = [
        {
            'id': r[0], 'name': r[1], 'category': r[2], 'desc': r[3],
            'price': r[4], 'priceUnit': r[5], 'badge': r[6], 'img': r[7],
            'inStock': r[8], 'availableDate': r[9].strftime('%d %B').replace('January','января').replace('February','февраля').replace('March','марта').replace('April','апреля').replace('May','мая').replace('June','июня').replace('July','июля').replace('August','августа').replace('September','сентября').replace('October','октября').replace('November','ноября').replace('December','декабря') if r[9] else None
        }
        for r in rows
    ]
    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'site_closed': False, 'products': products}, ensure_ascii=False)}