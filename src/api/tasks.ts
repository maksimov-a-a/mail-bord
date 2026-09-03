import { supabase, TASKS_TABLE } from '../supabaseClient';
import type { Task, TaskStatus } from '../types/task';

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from(TASKS_TABLE)
    .select('*')
    .order('received_at', { ascending: false });

  if (error) throw error;
  return data as Task[];
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const { error } = await supabase.from(TASKS_TABLE).update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from(TASKS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

export interface NewTaskInput {
  title: string;
  status: TaskStatus;
  owner_email: string | null;
  owner_name: string | null;
}

export async function createTask(input: NewTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from(TASKS_TABLE)
    .insert({
      title: input.title,
      status: input.status,
      owner_email: input.owner_email,
      owner_name: input.owner_name,
      sender_email: 'вручную',
      received_at: new Date().toISOString(),
      priority: 'normal',
      is_shared: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}
