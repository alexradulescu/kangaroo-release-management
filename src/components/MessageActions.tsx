import React, { memo, useCallback } from 'react';
import { Group, ActionIcon } from '@mantine/core';
import { Copy, MessageSquare } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { Check } from 'lucide-react';
import { ENV } from '../config/env';

interface MessageActionsProps {
  message: string;
}

export const MessageActions = memo(function MessageActions({ message }: MessageActionsProps) {
  const copyToClipboard = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(message);
    notifications.show({
      title: 'Copied to clipboard',
      message: 'Message has been copied and ready to paste in Slack',
      icon: <Check size={16} />,
      color: 'teal',
    });
  }, [message]);

  const openSlack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(ENV.SLACK_URL, '_blank');
  }, []);

  return (
    <Group gap="xs">
      <ActionIcon
        variant="subtle"
        color="blue"
        size="sm"
        onClick={copyToClipboard}
      >
        <Copy size={14} />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        color="blue"
        size="sm"
        onClick={openSlack}
      >
        <MessageSquare size={14} />
      </ActionIcon>
    </Group>
  );
});