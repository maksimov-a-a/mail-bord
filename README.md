# Почта → Задачи

Канбан-доска (Trello/Kaiten-стиль), которая наполняется письмами из Outlook через
Power Automate. Стек: React + TypeScript + Vite, TanStack Query, Supabase (БД +
Realtime), Mantine (UI), dnd-kit (drag-and-drop), Vercel (хостинг).

## 1. Supabase

1. Создайте проект на supabase.com.
2. В SQL Editor выполните:

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  title text not null,
  description text,
  sender_email text,
  received_at timestamptz default now(),
  priority text default 'normal',
  status text default 'inbox',
  owner_email text,
  owner_name text,
  is_shared boolean default false,
  created_at timestamptz default now()
);

alter publication supabase_realtime add table tasks;

alter table tasks enable row level security;
create policy "allow all for anon" on tasks for all using (true) with check (true);
```

3. В Project Settings → API скопируйте `Project URL` и `anon public` ключ.

## 2. Локальный запуск

```bash
npm install
cp .env.local.example .env.local
# впишите в .env.local ваши VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY
npm run dev
```

Откроется на http://localhost:5173.

## 3. Деплой на Vercel

1. Залейте проект в GitHub (`git init`, `git add .`, `git commit`, создайте репозиторий
   на github.com, `git push`).
2. На vercel.com → Add New → Project → выберите этот репозиторий.
3. Framework Preset определится автоматически как Vite.
4. В Environment Variables добавьте `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   `VITE_SUPABASE_TABLE` (значение `tasks`) — те же, что в `.env.local`.
5. Deploy. Через минуту получите постоянную ссылку вида `https://ваш-проект.vercel.app`.

## 4. Power Automate

Для каждого сотрудника — свой Cloud Flow с триггером «When a new email arrives (V3)»
и HTTP-действием `POST` на `https://ВАШ_ПРОЕКТ.supabase.co/rest/v1/tasks` с полями
`title`, `description`, `sender_email`, `received_at`, `priority`, `external_id`,
`owner_email`, `owner_name`, `is_shared`, `status: "inbox"`.

## Структура проекта

```
src/
  api/tasks.ts               — запросы к Supabase
  hooks/useTasks.ts          — TanStack Query (чтение, мутации)
  hooks/useRealtimeTasks.ts  — подписка на Supabase Realtime
  hooks/useWhoAmI.ts         — локальная метка "кто я" (localStorage, не авторизация)
  components/                — UI на Mantine + dnd-kit
  theme.ts                   — тема Mantine
```
