import { useDroppable } from '@dnd-kit/core';
import { Badge, Button, Group, Stack, Text, Box } from '@mantine/core';
import type { Column as ColumnType, Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface Props {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (columnId: ColumnType['id']) => void;
}

export function Column({ column, tasks, onAddTask }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });

  return (
    <Box
      w={300}
      miw={300}
      style={{
        background: isOver ? 'rgba(181,64,47,0.08)' : 'rgba(255,255,255,0.035)',
        border: `1px solid ${isOver ? '#b5402f' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 150px)',
      }}
    >
      <Group justify="space-between" p="sm" pb="6px">
        <Text ff="monospace" size="sm" c="#efe7d4">
          {column.title}
        </Text>
        <Badge circle variant="outline" color="gray">
          {tasks.length}
        </Badge>
      </Group>

      <Stack
        ref={setNodeRef}
        gap="sm"
        p="sm"
        pt="2px"
        style={{ overflowY: 'auto', flex: 1, minHeight: 60 }}
      >
        {tasks.length === 0 && (
          <Box
            style={{
              border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: 18,
              textAlign: 'center',
            }}
          >
            <Text size="xs" c="rgba(255,255,255,0.28)">
              тут пока пусто
            </Text>
          </Box>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Stack>

      <Button
        variant="subtle"
        color="gray"
        size="xs"
        m="sm"
        mt="0"
        onClick={() => onAddTask(column.id)}
      >
        + добавить задачу
      </Button>
    </Box>
  );
}
