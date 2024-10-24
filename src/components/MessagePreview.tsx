import React from 'react';
import { Paper, Button, Text, CopyButton, Group } from '@mantine/core';
import { Copy, Check } from 'lucide-react';

interface MessagePreviewProps {
  title: string;
  message: string;
  onCopy: () => void;
  disabled: boolean;
}

export function MessagePreview({ title, message, onCopy, disabled }: MessagePreviewProps) {
  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{title}</Text>
        <CopyButton value={message} timeout={2000}>
          {({ copied, copy }) => (
            <Button
              variant="light"
              color={copied ? 'teal' : 'blue'}
              size="sm"
              leftSection={copied ? <Check size={16} /> : <Copy size={16} />}
              onClick={() => {
                copy();
                onCopy();
              }}
              disabled={disabled}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
        </CopyButton>
      </Group>
      <Paper p="sm" bg="dark.6">
        <Text component="pre" size="sm" style={{ whiteSpace: 'pre-wrap' }}>
          {message}
        </Text>
      </Paper>
    </Paper>
  );
}