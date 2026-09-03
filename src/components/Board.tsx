import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Group } from '@mantine/core';
import { COLUMNS, type Task, type TaskStatus } from '../types/task';
import { Column } from './Column';
import type { FilterMode } from './Header';
import type { WhoAmI } from '../hooks/useWhoAmI';

interface Props {
  tasks: Task[];
  filter: FilterMode;
  me: WhoAmI | null;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onAddTask: (columnId: TaskStatus) => void;
}

export function Board({ tasks, filter, me, onStatusChange, onAddTask }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const visible = tasks.filter((t) => {
    if (filter === 'mine') return !t.is_shared && t.owner_email === me?.email;
    if (filter === 'shared') return t.is_shared;
    return true;
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === active.id);
    if (task && task.status !== newStatus) {
      onStatusChange(task.id, newStatus);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Group align="flex-start" gap="md" p="lg" style={{ overflowX: 'auto' }} wrap="nowrap">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={visible.filter((t) => t.status === column.id)}
            onAddTask={onAddTask}
          />
        ))}
      </Group>
    </DndContext>
  );
}
