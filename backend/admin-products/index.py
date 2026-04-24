import json
import os
import psycopg2

SCHEMA = "t_p10284751_frozen_meat_sales_ap"

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
    'Content-Type': 'application/json'
}

def handler(event: dict, context) -> dict:
    """CRUD товаров для админки"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod')
    params = event.get('queryStringParameters') or {}
    body = json.loads(event.get('body') or '{}')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        # Получить все товары
        if method == 'GET':
            cur.execute(f"SELECT id, name, category, description, price, price_unit, badge, img_url, is_active, sort_order FROM {SCHEMA}.products ORDER BY sort_order, id")
            rows = cur.fetchall()
            products = [
                {'id': r[0], 'name': r[1], 'category': r[2], 'description': r[3],
                 'price': r[4], 'price_unit': r[5], 'badge': r[6], 'img_url': r[7],
                 'is_active': r[8], 'sort_order': r[9]}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'products': products})}

        # Создать товар
        if method == 'POST':
            cur.execute(
                f"INSERT INTO {SCHEMA}.products (name, category, description, price, price_unit, badge, img_url, sort_order) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (body.get('name'), body.get('category'), body.get('description'),
                 body.get('price'), body.get('price_unit', 'за кг'), body.get('badge'),
                 body.get('img_url'), body.get('sort_order', 0))
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'id': new_id})}

        # Обновить товар
        if method == 'PUT':
            pid = body.get('id')
            cur.execute(
                f"UPDATE {SCHEMA}.products SET name=%s, category=%s, description=%s, price=%s, price_unit=%s, badge=%s, img_url=%s, is_active=%s, sort_order=%s, updated_at=NOW() WHERE id=%s",
                (body.get('name'), body.get('category'), body.get('description'),
                 body.get('price'), body.get('price_unit', 'за кг'), body.get('badge'),
                 body.get('img_url'), body.get('is_active', True), body.get('sort_order', 0), pid)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # Удалить товар
        if method == 'DELETE':
            pid = params.get('id') or body.get('id')
            cur.execute(f"DELETE FROM {SCHEMA}.products WHERE id=%s", (pid,))
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    finally:
        cur.close()
        conn.close()

    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
