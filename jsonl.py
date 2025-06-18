import psycopg2
import json

# Koneksi database
conn = psycopg2.connect(
    dbname='chatbot_db',
    user='postgres',       
    password='postgres',   
    host='localhost',
    port='5432'
)

with conn.cursor() as cur:
    cur.execute("""
        SELECT user_input, bot_response
        FROM conversations
        ORDER BY created_at ASC
    """)
    rows = cur.fetchall()

# Simpan ke file JSONL
with open('conversations.jsonl', 'w', encoding='utf-8') as f:
    for row in rows:
        item = {
            'user': row[0],
            'bot': row[1]
        }
        f.write(json.dumps(item, ensure_ascii=False) + '\n')

print(f'Export selesai! Total percakapan: {len(rows)}')
