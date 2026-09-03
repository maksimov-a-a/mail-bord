import { Group, Text, Badge, Button, ActionIcon, Tooltip, SegmentedControl } from '@mantine/core';
import { IconRefresh, IconUserCircle } from '@tabler/icons-react';
import type { WhoAmI } from '../hooks/useWhoAmI';

export type FilterMode = 'all' | 'mine' | 'shared';

interface Props {
  isFetching: boolean;
  taskCount: number;
  me: WhoAmI | null;
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
  onRefresh: () => void;
  onOpenWhoAmI: () => void;
}

export function Header({ isFetching, taskCount, me, filter, onFilterChange, onRefresh, onOpenWhoAmI }: Props) {
  return (
    <Group
      justify="space-between"
      px="lg"
      py="md"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <Group gap="sm" align="baseline">
        <Badge variant="outline" color="stamp" radius="sm" style={{ transform: 'rotate(-3deg)' }}>
          EX 2013
        </Badge>
        <Text size="lg" fw={600} c="#f6f1e6">
          Почта → Задачи
        </Text>
      </Group>

      <Group gap="md">
        <SegmentedControl
          size="xs"
          value={filter}
          onChange={(v) => onFilterChange(v as FilterMode)}
          data={[
            { label: 'Все', value: 'all' },
            { label: 'Мои', value: 'mine' },
            { label: 'Общие', value: 'shared' },
          ]}
        />
        <Text size="xs" c="dimmed" ff="monospace">
          {isFetching ? 'обновление…' : `${taskCount} карточек`}
        </Text>
        <Tooltip label="Обновить вручную">
          <ActionIcon variant="default" onClick={onRefresh}>
            <IconRefresh size={16} />
          </ActionIcon>
        </Tooltip>
        <Button
          variant="default"
          size="xs"
          leftSection={<IconUserCircle size={16} />}
          onClick={onOpenWhoAmI}
        >
          {me?.name || me?.email || 'Кто вы?'}
        </Button>
      </Group>
    </Group>
  );
}
