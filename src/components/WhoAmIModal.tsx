import { useState } from 'react';
import { Modal, TextInput, Button, Stack, Text, Group } from '@mantine/core';
import type { WhoAmI } from '../hooks/useWhoAmI';

interface Props {
  opened: boolean;
  initial: WhoAmI | null;
  onClose: () => void;
  onSave: (me: WhoAmI) => void;
}

export function WhoAmIModal({ opened, initial, onClose, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');

  return (
    <Modal opened={opened} onClose={onClose} title="Кто вы?" centered>
      <Stack gap="sm">
        <Text size="xs" c="dimmed">
          Это не пароль и не вход в систему — просто метка, чтобы доска понимала, какие карточки
          подсвечивать во вкладке «Мои». Укажите то же имя/почту, что стоит в поле owner_name /
          owner_email вашего потока Power Automate.
        </Text>
        <TextInput label="Имя" placeholder="Иван Петров" value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <TextInput
          label="Почта"
          placeholder="ivan.petrov@company.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <Group justify="flex-end" mt="sm">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Отмена
          </Button>
          <Button
            color="stamp"
            disabled={!email.trim()}
            onClick={() => onSave({ name: name.trim(), email: email.trim() })}
          >
            Сохранить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
