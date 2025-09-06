import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Learn() {
  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">FreelTON · Stack & Architecture</h1>
        <p className="mt-2 text-white/70">
          Рекомендуемая архитектура под TON. Ниже — составные части и зачем они нужны. Дизайн и навигация остаются прежними.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2">
              <Badge>Smart‑contracts</Badge>
              <span className="text-sm text-white/60">Ядро системы</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">Tact + Blueprint</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
              <li>Tact — безопасный язык под TON (TypeScript/Rust‑like).</li>
              <li>Blueprint — локальная разработка, тесты (Sandbox) и деплой.</li>
              <li>TON Access — надёжное RPC для фронтенда и бэкенда.</li>
            </ul>
            <Separator className="my-4 bg-white/10" />
            <p className="text-sm text-white/70">Функции: escrow депозиты, арбитраж, рейтинги (хэши отзывов), комиссия платформы.</p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Backend</Badge>
              <span className="text-sm text-white/60">Серверная логика</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">TypeScript/Node (NestJS) или Go (Echo)</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
              <li>Хранение вне блокчейна: профили, описания задач, сообщения.</li>
              <li>БД: PostgreSQL (реляционные данные) или MongoDB (документы).</li>
              <li>Индексатор: TON API / Getgems API; при желании — свой нод.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2">
              <Badge>Frontend</Badge>
              <span className="text-sm text-white/60">Интерфейс</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">React (Next.js)</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
              <li>TonConnect SDK — подключение кошельков (Tonkeeper, MyTonWallet).</li>
              <li>UI: Chakra/Mantine/AntD или кастом — текущий дизайн сохранён.</li>
              <li>SEO и SSR/ISR из Next.js для публичной витрины.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Storage</Badge>
              <span className="text-sm text-white/60">Медиа и файлы</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">IPFS + TON Storage</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
              <li>Генерируем CID и пишем хэш в контракт — проверяемость и неизменность.</li>
              <li>CDN (Cloudflare) для быстрой раздачи.</li>
            </ul>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Поток действий</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-white/80">
            <li>Юзер открывает сайт и подключает кошелёк через TonConnect.</li>
            <li>Создание задания отправляет запрос на Backend.</li>
            <li>Backend формирует вызов контракта; пользователь подписывает транзакцию.</li>
            <li>Backend слушает события (TON API) и обновляет БД.</li>
            <li>Frontend показывает состояние из БД и из блокчейна (баланс escrow).</li>
          </ol>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Тестирование и деплой</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
            <li>Контракты: Blueprint Sandbox + юнит‑тесты.</li>
            <li>Backend: Jest/Vitest; инфраструктура — AWS/GCP/DO/Heroku.</li>
            <li>Frontend: Vercel/Netlify (мы можем подключить MCP для автодеплоя).</li>
            <li>Контракты: деплой через Blueprint/ton‑cli.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
