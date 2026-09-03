import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge, Group, Paper, Text, ActionIcon, Avatar } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import type { Task } from '../types/task';
import { useDeleteTask } from '../hooks/useTasks';

const priorityColor: Record<string, string> = {
  high: 'stamp',
  normal: 'ink',
  low: 'green',
};

function initials(nameOrEmail: string) {
  const parts = nameOrEmail.split('@')[0].split(/[.\s_]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nameOrEmail.slice(0, 2).toUpperCase();
}

function formatDate(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) +
    ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });
  const deleteTask = useDeleteTask();

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  const ownerDisplay = task.owner_name || task.owner_email;
  const color = priorityColor[task.priority ?? 'normal'] ?? 'ink';

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      withBorder
      p="sm"
      radius="md"
      pos="relative"
      bg="#f6f1e6"
      styles={{ root: { borderLeft: `3px solid var(--mantine-color-${color}-6)`, cursor: 'grab' } }}
    >
      <ActionIcon
        variant="subtle"
        color="gray"
        size="sm"
        pos="absolute"
        top={6}
        right={6}
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Удалить карточку «${task.title}»?`)) {
            deleteTask.mutate(task.id);
          }
        }}
      >
        <IconX size={14} />
      </ActionIcon>

      {task.is_shared ? (
        <Badge color="stamp" variant="light" size="xs" mb="6px">
          общее
        </Badge>
      ) : ownerDisplay ? (
        <Group gap="6px" mb="6px">
          <Avatar size={18} radius="xl" color="ink">
            <Text size="9px" fw={700}>{initials(ownerDisplay)}</Text>
          </Avatar>
          <Text size="xs" c="dimmed">{ownerDisplay}</Text>
        </Group>
      ) : null}

      <Text fw={600} size="sm" c="#22344a" mb="4px" pr="md">
        {task.title || 'Без темы'}
      </Text>

      {task.description && (
        <Text size="xs" c="#5a5548" mb="8px" lineClamp={2}>
          {task.description}
        </Text>
      )}

      <Group justify="space-between" pt="6px" styles={{ root: { borderTop: '1px solid #d9cfba' } }}>
        <Text size="xs" c="dimmed" truncate maw={170}>
          {task.sender_email}
        </Text>
        <Text size="xs" c="dimmed">
          {formatDate(task.received_at)}
        </Text>
      </Group>
    </Paper>
  );
}
