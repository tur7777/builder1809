from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
APP_BASE_URL = os.environ.get("APP_BASE_URL", "")
WELCOME = (
    "Welcome to FreeTON Freelance Exchange! 🎉\n"
    "I'm @freeltonrobot, your assistant for managing tasks and payments on the TON blockchain.\n"
    "Please connect your TON wallet to get started. Use the WebApp below to begin! 🚀"
)


def send_message(chat_id: int, text: str, reply_markup: dict | None = None):
    if not BOT_TOKEN:
        return
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            resp.read()
    except urllib.error.URLError:
        pass


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("content-length", "0"))
            raw = self.rfile.read(length) if length > 0 else b"{}"
            update = json.loads(raw.decode("utf-8") or "{}")
            message = update.get("message") or {}
            chat = (message.get("chat") or {}).get("id")
            text = (message.get("text") or "").strip()

            if chat and text.startswith("/start"):
                kb = None
                if APP_BASE_URL:
                    kb = {"inline_keyboard": [[{"text": "Open FreeTON", "web_app": {"url": APP_BASE_URL}}]]}
                send_message(chat, WELCOME, kb)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b"{\"ok\":true}")
        except Exception:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b"{\"ok\":true}")
