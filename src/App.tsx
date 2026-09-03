import { useState } from 'react';
import { Box } from '@mantine/core';
import { useTasks, useUpdateTaskStatus, useCreateTask } from './hooks/useTasks';
import { useRealtimeTasks } from './hooks/useRealtimeTasks';
import { useWhoAmI } from './hooks/useWhoAmI';
import { Header, type FilterMode } from './components/Header';
import { Board } from './components/Board';
import { WhoAmIModal } from './components/WhoAmIModal';
import { AddTaskModal } from './components/AddTaskModal';
import type { TaskStatus } from './types/task';

export default function App() {
  const { data: tasks = [], isFetching, refetch } = useTasks();
  useRealtimeTasks();

  const updateStatus = useUpdateTaskStatus();
  const createTask = useCreateTask();
  const { me, setMe } = useWhoAmI();

  const [filter, setFilter] = useState<FilterMode>('all');
  const [whoAmIOpen, setWhoAmIOpen] = useState(!me);
  const [addTaskStatus, setAddTaskStatus] = useState<TaskStatus | null>(null);

  return (
    <Box
      mih="100vh"
      style={{
        background: 'radial-gradient(ellipse at top left, #262218, #2c2823 60%)',
      }}
    >
      <Header
        isFetching={isFetching}
        taskCount={tasks.length}
        me={me}
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={() => refetch()}
        onOpenWhoAmI={() => setWhoAmIOpen(true)}
      />

      <Board
        tasks={tasks}
        filter={filter}
        me={me}
        onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
        onAddTask={(status) => setAddTaskStatus(status)}
      />

      <WhoAmIModal
        opened={whoAmIOpen}
        initial={me}
        onClose={() => setWhoAmIOpen(false)}
        onSave={(value) => {
          setMe(value);
          setWhoAmIOpen(false);
        }}
      />

      <AddTaskModal
        opened={addTaskStatus !== null}
        status={addTaskStatus}
        onClose={() => setAddTaskStatus(null)}
        onSubmit={(title) => {
          if (!addTaskStatus) return;
          createTask.mutate({
            title,
            status: addTaskStatus,
            owner_email: me?.email ?? null,
            owner_name: me?.name ?? null,
          });
          setAddTaskStatus(null);
        }}
      />
    </Box>
  );
}
