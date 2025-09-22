import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = os.environ.get("8283212464:AAFMiygjsGhahRhvrcjQYgP9RpuLmHEZs5k", "")
APP_BASE_URL = os.environ.get("https://builder1809-nine.vercel.app/", "")

WELCOME = (
    "Welcome to FreeTON Freelance Exchange! 🎉\n"
    "I'm @freeltonrobot, your assistant for managing tasks and payments on the TON blockchain.\n"
    "Please connect your TON wallet to get started. Use the WebApp below to begin! 🚀"
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return
    kb = None
    if APP_BASE_URL:
        kb = InlineKeyboardMarkup(
            [[InlineKeyboardButton(text="Open FreeTON", web_app=WebAppInfo(url=APP_BASE_URL))]]
        )
    await update.message.reply_text(WELCOME, reply_markup=kb)

async def main() -> None:
    if not BOT_TOKEN:
        raise SystemExit("TELEGRAM_BOT_TOKEN is not set")
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    await app.initialize()
    # Long polling run
    await app.start()
    try:
        await app.updater.start_polling(allowed_updates=Update.ALL_TYPES)
        await app.updater.idle()
    finally:
        await app.stop()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
