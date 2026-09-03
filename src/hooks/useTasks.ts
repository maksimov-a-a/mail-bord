import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, fetchTasks, updateTaskStatus, type NewTaskInput } from '../api/tasks';
import type { Task, TaskStatus } from '../types/task';

export const TASKS_QUERY_KEY = ['tasks'] as const;

export function useTasks() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchTasks,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => updateTaskStatus(id, status),
    // Оптимистичное обновление: сразу двигаем карточку, откатываем при ошибке
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        old?.map((t) => (t.id === id ? { ...t, status } : t))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previous);
      }
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewTaskInput) => createTask(input),
    onSuccess: (created) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) => [created, ...(old ?? [])]);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) => old?.filter((t) => t.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previous);
      }
    },
  });
}
