import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = "t_p10284751_frozen_meat_sales_ap"

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Авторизация администратора"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id'}, 'body': ''}

    method = event.get('httpMethod')
    path = event.get('path', '/')
    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    # Проверка сессии
    if method == 'GET' and path.endswith('/check'):
        session_id = event.get('headers', {}).get('X-Session-Id', '')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT admin_id FROM {SCHEMA}.admin_sessions WHERE session_id = %s", (session_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False})}

    # Логин
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        login = body.get('login', '')
        password = body.get('password', '')
        password_hash = hashlib.md5(password.encode()).hexdigest()

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.admin_users WHERE login = %s AND password_hash = %s", (login, password_hash))
        row = cur.fetchone()
        if row:
            session_id = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.admin_sessions (session_id, admin_id, login) VALUES (%s, %s, %s)", (session_id, row[0], login))
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'session_id': session_id})}
        cur.close()
        conn.close()
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'ok': False, 'error': 'Неверный логин или пароль'})}

    # Выход
    if method == 'DELETE':
        session_id = event.get('headers', {}).get('X-Session-Id', '')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.admin_sessions WHERE session_id = %s", (session_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not found'})}
