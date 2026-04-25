import json
import os
import psycopg2

SCHEMA = "t_p10284751_frozen_meat_sales_ap"

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id, X-User-Session',
    'Content-Type': 'application/json'
}

def handler(event: dict, context) -> dict:
    """Управление заявками: получение, сохранение, архив, статистика"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod')
    body = json.loads(event.get('body') or '{}')
    params = event.get('queryStringParameters') or {}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        # История заказов пользователя (по сессии)
        if method == 'GET' and params.get('type') == 'my_orders':
            user_session = event.get('headers', {}).get('X-User-Session', '')
            cur.execute(f"SELECT user_id FROM {SCHEMA}.user_sessions WHERE session_id = %s", (user_session,))
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'ok': False, 'error': 'Не авторизован'})}
            user_id = row[0]
            cur.execute(f"""
                SELECT id, name, phone, message, status, created_at, total, items, delivery_cost
                FROM {SCHEMA}.orders
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 50
            """, (user_id,))
            rows = cur.fetchall()
            orders = [
                {'id': r[0], 'name': r[1], 'phone': r[2], 'message': r[3],
                 'status': r[4], 'created_at': r[5].isoformat(),
                 'total': r[6], 'items': r[7], 'delivery_cost': r[8]}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'orders': orders})}

        # Проверка лояльности по телефону
        if method == 'GET' and params.get('type') == 'loyalty':
            phone = params.get('phone', '').strip()
            cur.execute(f"""
                SELECT COUNT(*) FROM {SCHEMA}.orders
                WHERE REGEXP_REPLACE(phone, '[^0-9]', '', 'g') = REGEXP_REPLACE(%s, '[^0-9]', '', 'g')
                AND status NOT IN ('cancelled')
            """, (phone,))
            count = cur.fetchone()[0]
            if count >= 20:
                discount = 25
            elif count >= 10:
                discount = 15
            elif count >= 3:
                discount = 5
            else:
                discount = 0
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'count': count, 'discount': discount})}

        # Получить активные заявки (не в архиве)
        if method == 'GET' and params.get('type') != 'archive' and params.get('type') != 'stats':
            cur.execute(f"""
                SELECT id, name, phone, email, message, status, created_at
                FROM {SCHEMA}.orders
                WHERE status != 'archived'
                ORDER BY created_at DESC
            """)
            rows = cur.fetchall()
            orders = [
                {'id': r[0], 'name': r[1], 'phone': r[2], 'email': r[3],
                 'message': r[4], 'status': r[5], 'created_at': r[6].isoformat()}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'orders': orders})}

        # Получить архив
        if method == 'GET' and params.get('type') == 'archive':
            cur.execute(f"""
                SELECT id, name, phone, email, message, status, created_at
                FROM {SCHEMA}.orders
                WHERE status = 'archived'
                ORDER BY created_at DESC
                LIMIT 100
            """)
            rows = cur.fetchall()
            orders = [
                {'id': r[0], 'name': r[1], 'phone': r[2], 'email': r[3],
                 'message': r[4], 'status': r[5], 'created_at': r[6].isoformat()}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'orders': orders})}

        # Статистика бухгалтерии
        if method == 'GET' and params.get('type') == 'stats':
            period = params.get('period', 'month')
            if period == 'today':
                date_filter = "created_at >= CURRENT_DATE"
            elif period == 'week':
                date_filter = "created_at >= CURRENT_DATE - INTERVAL '7 days'"
            else:
                date_filter = "created_at >= DATE_TRUNC('month', CURRENT_DATE)"

            cur.execute(f"""
                SELECT COUNT(*), COALESCE(SUM(total), 0)
                FROM {SCHEMA}.orders
                WHERE status = 'done' AND {date_filter}
            """)
            row = cur.fetchone()
            count, revenue = row[0], int(row[1])

            # Топ товаров из items jsonb
            cur.execute(f"""
                SELECT item->>'name' as name,
                       SUM((item->>'qty')::numeric) as total_qty,
                       SUM((item->>'sum')::numeric) as total_sum
                FROM {SCHEMA}.orders,
                     jsonb_array_elements(items) as item
                WHERE status = 'done' AND {date_filter} AND items IS NOT NULL
                GROUP BY item->>'name'
                ORDER BY total_sum DESC
                LIMIT 10
            """)
            items_rows = cur.fetchall()
            top_items = [{'name': r[0], 'qty': float(r[1]), 'sum': int(r[2])} for r in items_rows]

            # Заказы по дням
            cur.execute(f"""
                SELECT DATE(created_at) as day, COUNT(*), COALESCE(SUM(total), 0)
                FROM {SCHEMA}.orders
                WHERE status = 'done' AND {date_filter}
                GROUP BY DATE(created_at)
                ORDER BY day DESC
            """)
            days_rows = cur.fetchall()
            by_day = [{'day': r[0].strftime('%d.%m.%Y'), 'count': r[1], 'revenue': int(r[2])} for r in days_rows]

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'ok': True, 'count': count, 'revenue': revenue, 'top_items': top_items, 'by_day': by_day
            })}

        # Получить/переключить режим "Не беспокоить"
        if method == 'GET' and params.get('type') == 'site_status':
            cur.execute(f"SELECT value FROM {SCHEMA}.settings WHERE key='site_closed'")
            row = cur.fetchone()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'site_closed': row and row[0] == 'true'})}

        if method == 'PUT' and body.get('action') == 'toggle_site':
            closed = 'true' if body.get('site_closed') else 'false'
            cur.execute(f"UPDATE {SCHEMA}.settings SET value=%s, updated_at=NOW() WHERE key='site_closed'", (closed,))
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'site_closed': closed == 'true'})}

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

        # Удалить заявку совсем
        if method == 'DELETE':
            oid = params.get('id') or body.get('id')
            cur.execute(f"DELETE FROM {SCHEMA}.orders WHERE id=%s", (oid,))
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    finally:
        cur.close()
        conn.close()

    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}