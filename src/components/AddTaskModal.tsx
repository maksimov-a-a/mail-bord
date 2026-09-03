import { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Stack, Group } from '@mantine/core';
import type { TaskStatus } from '../types/task';

interface Props {
  opened: boolean;
  status: TaskStatus | null;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

export function AddTaskModal({ opened, status, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (opened) setTitle('');
  }, [opened]);

  return (
    <Modal opened={opened && !!status} onClose={onClose} title="Новая задача" centered>
      <Stack gap="sm">
        <TextInput
          label="Название"
          placeholder="Что нужно сделать"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && title.trim()) onSubmit(title.trim());
          }}
        />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Отмена
          </Button>
          <Button color="stamp" disabled={!title.trim()} onClick={() => onSubmit(title.trim())}>
            Добавить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
