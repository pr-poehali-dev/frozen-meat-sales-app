import json
import os
import psycopg2

SCHEMA = "t_p10284751_frozen_meat_sales_ap"

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
    'Content-Type': 'application/json'
}

def handler(event: dict, context) -> dict:
    """Управление заявками: получение и сохранение"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod')
    body = json.loads(event.get('body') or '{}')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        # Получить все заявки (для админки)
        if method == 'GET':
            cur.execute(f"SELECT id, name, phone, email, message, status, created_at FROM {SCHEMA}.orders ORDER BY created_at DESC")
            rows = cur.fetchall()
            orders = [
                {'id': r[0], 'name': r[1], 'phone': r[2], 'email': r[3],
                 'message': r[4], 'status': r[5], 'created_at': r[6].isoformat()}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'orders': orders})}

        # Создать новую заявку (с сайта)
        if method == 'POST':
            cur.execute(
                f"INSERT INTO {SCHEMA}.orders (name, phone, email, message) VALUES (%s, %s, %s, %s) RETURNING id",
                (body.get('name'), body.get('phone'), body.get('email'), body.get('message'))
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'id': new_id})}

        # Обновить статус заявки
        if method == 'PUT':
            cur.execute(
                f"UPDATE {SCHEMA}.orders SET status=%s WHERE id=%s",
                (body.get('status'), body.get('id'))
            )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    finally:
        cur.close()
        conn.close()

    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
