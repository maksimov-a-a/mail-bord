import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, TASKS_TABLE } from '../supabaseClient';
import { TASKS_QUERY_KEY } from './useTasks';
import type { Task } from '../types/task';

/**
 * Подписывается на изменения таблицы задач через Supabase Realtime (WebSocket).
 * Когда письмо прилетает через Power Automate у другого человека, INSERT
 * долетает сюда без перезагрузки страницы и без опроса (polling).
 */
export function useRealtimeTasks() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TASKS_TABLE },
        (payload) => {
          queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) => {
            if (payload.eventType === 'INSERT') {
              const newTask = payload.new as Task;
              if (old.some((t) => t.id === newTask.id)) return old;
              return [newTask, ...old];
            }
            if (payload.eventType === 'UPDATE') {
              const updated = payload.new as Task;
              return old.map((t) => (t.id === updated.id ? updated : t));
            }
            if (payload.eventType === 'DELETE') {
              const removedId = (payload.old as Task).id;
              return old.filter((t) => t.id !== removedId);
            }
            return old;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
