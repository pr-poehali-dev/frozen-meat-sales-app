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
    """Публичный список активных товаров для каталога на сайте"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(f"""
        SELECT id, name, category, description, price, price_unit, badge, img_url
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
            'price': r[4], 'priceUnit': r[5], 'badge': r[6], 'img': r[7]
        }
        for r in rows
    ]
    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'products': products}, ensure_ascii=False)}
