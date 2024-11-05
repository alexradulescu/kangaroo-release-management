import React, { memo, useCallback } from 'react';
import { Accordion, Button, Text, Group, Paper, Tooltip } from '@mantine/core';
import { Copy, MessageSquare, Check } from 'lucide-react';
import { notifications } from '@mantine/notifications';

interface MessageAccordionProps {
  title: string;
  message: string;
  disabled: boolean;
}

export const MessageAccordion = memo(function MessageAccordion({ 
  title, 
  message, 
  disabled,
}: MessageAccordionProps) {
  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(message);
    notifications.show({
      title: 'Copied to clipboard',
      message: 'Message has been copied and ready to paste in Slack',
      icon: <Check size={16} />,
      color: 'teal',
    });
  }, [message]);

  const openSlack = useCallback(() => {
    window.open('slack://open', '_blank');
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard();
  };

  const handleCopyAndSlack = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard();
    openSlack();
  };

  const renderControls = () => (
    <Button.Group>
      <Button
        variant="light"
        color="blue"
        size="xs"
        onClick={handleCopyAndSlack}
        disabled={disabled}
      >
        Copy & Slack
      </Button>
      <Tooltip label="Copy">
        <Button
          variant="light"
          color="gray"
          onClick={handleCopy}
          disabled={disabled}
          size="xs"
        >
          <Copy size={16} />
        </Button>
      </Tooltip>
      <Tooltip label="Open Slack">
        <Button
          variant="light"
          color="gray"
          onClick={openSlack}
          disabled={disabled}
          size="xs"
        >
          <MessageSquare size={16} />
        </Button>
      </Tooltip>
    </Button.Group>
  );

  return (
    <Accordion variant="contained">
      <Accordion.Item value="message">
        <Accordion.Control disabled={disabled}>
          <Group justify="space-between" wrap="nowrap" style={{ width: '100%' }} pr="sm">
            <Text fw={500}>{title}</Text>
            {renderControls()}
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Paper p="sm" bg="dark.6">
            <Text component="pre" size="sm" style={{ whiteSpace: 'pre-wrap' }}>
              {message}
            </Text>
          </Paper>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
});