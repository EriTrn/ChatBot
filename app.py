from flask import Flask, render_template, request, jsonify, session
import requests
import psycopg2
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = 'SECRET_KEY'

# Koneksi PostgreSQL
conn = psycopg2.connect(
    dbname='chatbot_db',
    user='postgres',
    password='postgres',
    host='localhost',
    port='5432'
)

# Inisialisasi session_id
@app.before_request
def set_session_id():
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())

# Simpan percakapan
def save_conversation(user_input, bot_response):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO conversations (session_id, user_input, bot_response, created_at)
            VALUES (%s, %s, %s, %s)
        """, (
            session['session_id'],
            user_input,
            bot_response,
            datetime.utcnow()
        ))
        conn.commit()

# Beranda
@app.route('/')
def index():
    return render_template('index.html')

# Chat API
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    payload = {
        'model': 'deepseek-coder:1.3b',
        'prompt': user_input,
        'stream': False
    }
    response = requests.post('http://localhost:11434/api/generate', json=payload)
    data = response.json()
    bot_response = data.get('response', 'Maaf, saya tidak mengerti.')

    save_conversation(user_input, bot_response)
    return jsonify({'response': bot_response})

# Ambil riwayat chat
@app.route('/history', methods=['GET'])
def history():
    with conn.cursor() as cur:
        cur.execute("""
            SELECT user_input, bot_response FROM conversations
            WHERE session_id = %s ORDER BY created_at ASC
        """, (session['session_id'],))
        rows = cur.fetchall()
    return jsonify([
        {'user': r[0], 'bot': r[1]} for r in rows
    ])

# Hapus riwayat
@app.route('/clear', methods=['POST'])
def clear_history():
    with conn.cursor() as cur:
        cur.execute("DELETE FROM conversations WHERE session_id = %s", (session['session_id'],))
        conn.commit()
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)