import os, time, json, urllib.request, urllib.parse

TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TMA_URL = os.environ.get("TMA_URL", os.environ.get("APP_BASE_URL", ""))
WELCOME = (
    "Welcome to FreeTON Freelance Exchange! 🎉\n"
    "I'm @freeltonrobot, your assistant for managing tasks and payments on the TON blockchain.\n"
    "Please connect your TON wallet to get started. Use the WebApp below to begin! 🚀"
)

if not TOKEN:
    raise SystemExit("Set TELEGRAM_BOT_TOKEN env var")

API = f"https://api.telegram.org/bot{TOKEN}"

def api_call(method: str, payload: dict):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{API}/{method}", data=data, headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=70) as resp:
        return json.loads(resp.read().decode("utf-8"))

def send_start(chat_id: int):
    rm = None
    if TMA_URL:
        rm = {"inline_keyboard": [[{"text": "Open FreeTON", "web_app": {"url": TMA_URL}}]]}
    api_call("sendMessage", {
        "chat_id": chat_id,
        "text": WELCOME,
        "parse_mode": "HTML",
        **({"reply_markup": rm} if rm else {}),
    })


offset = 0
print("Bot started. Press Ctrl+C to stop.")
while True:
    try:
        updates = api_call("getUpdates", {"timeout": 60, "offset": offset})
        for upd in updates.get("result", []):
            offset = max(offset, int(upd.get("update_id", 0)) + 1)
            msg = upd.get("message") or {}
            text = (msg.get("text") or "").strip()
            chat = (msg.get("chat") or {}).get("id")
            if chat and text.startswith("/start"):
                send_start(chat)
    except KeyboardInterrupt:
        break
    except Exception:
        time.sleep(1)
