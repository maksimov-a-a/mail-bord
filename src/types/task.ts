export type TaskStatus = 'inbox' | 'in_progress' | 'done';

export interface Task {
  id: string;
  external_id: string | null;
  title: string;
  description: string | null;
  sender_email: string | null;
  received_at: string | null;
  priority: 'low' | 'normal' | 'high' | string | null;
  status: TaskStatus;
  owner_email: string | null;
  owner_name: string | null;
  is_shared: boolean;
  created_at: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'inbox', title: 'Входящие' },
  { id: 'in_progress', title: 'В работе' },
  { id: 'done', title: 'Готово' },
];
