import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Не заданы VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Проверьте файл .env.local (локально) ' +
      'или переменные окружения проекта в Vercel.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const TASKS_TABLE = (import.meta.env.VITE_SUPABASE_TABLE as string) || 'tasks';
