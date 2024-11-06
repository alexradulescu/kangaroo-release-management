import React, { memo } from 'react';
import { Checkbox, Group, Text, Button, Stack, Box } from '@mantine/core';
import { ExternalLink, Copy, MessageSquare } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { Check } from 'lucide-react';
import { ENV } from '../config/env';

interface SubItem {
  id: string;
  label: string;
}

interface ChecklistItemProps {
  id: string;
  label: string;
  description?: string;
  link?: string;
  showMessageActions?: boolean;
  message?: string;
  checked: boolean;
  subItems?: SubItem[];
  onToggle: (id: string) => void;
  onSubItemToggle?: (parentId: string, subId: string) => void;
  checkedSubItems?: string[];
  isLastInSection?: boolean;
}

export const ChecklistItem = memo(function ChecklistItem({
  id,
  label,
  description,
  link,
  showMessageActions,
  message,
  checked,
  subItems,
  onToggle,
  onSubItemToggle,
  checkedSubItems = [],
  isLastInSection = false,
}: ChecklistItemProps) {
  const [expanded, setExpanded] = React.useState(false);

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (message) {
      await navigator.clipboard.writeText(message);
      notifications.show({
        title: 'Copied to clipboard',
        message: 'Message has been copied and ready to paste in Slack',
        icon: <Check size={16} />,
        color: 'teal',
      });
    }
  };

  const openLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(link, '_blank');
  };

  const openSlack = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(ENV.SLACK_URL, '_blank');
  };

  const copyAndSlack = async (e: React.MouseEvent) => {
    await copyToClipboard(e);
    openSlack(e);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Box py="xs" style={{ 
      borderBottom: isLastInSection ? 'none' : '1px solid var(--mantine-color-dark-4)'
    }}>
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap" w="100%">
          <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
            <Checkbox
              checked={checked}
              onChange={() => onToggle(id)}
              styles={{ input: { cursor: 'pointer' } }}
            />
            <Stack gap={4}>
              <Text size="sm" style={{ cursor: 'default' }}>{label}</Text>
              {description && (
                <Text size="xs" c="dimmed">{description}</Text>
              )}
            </Stack>
          </Group>

          <Group gap="xs" wrap="nowrap">
            {link && (
              <Button
                variant="subtle"
                color="blue"
                size="xs"
                onClick={openLink}
                leftSection={<ExternalLink size={14} />}
              >
                Open
              </Button>
            )}
            {showMessageActions && message && (
              <Button.Group>
                <Button
                  variant="subtle"
                  color="blue"
                  size="xs"
                  onClick={copyAndSlack}
                >
                  Copy & Slack
                </Button>
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={copyToClipboard}
                  leftSection={<Copy size={14} />}
                >
                  Copy
                </Button>
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={openSlack}
                  leftSection={<MessageSquare size={14} />}
                >
                  Slack
                </Button>
              </Button.Group>
            )}
            {subItems && (
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                onClick={toggleExpand}
              >
                {expanded ? 'Hide Steps' : 'Show Steps'}
              </Button>
            )}
          </Group>
        </Group>

        {expanded && subItems && (
          <Stack gap="xs" ml={48}>
            {subItems.map(subItem => (
              <Group key={subItem.id} gap="md">
                <Checkbox
                  size="xs"
                  checked={checkedSubItems.includes(subItem.id)}
                  onChange={() => onSubItemToggle?.(id, subItem.id)}
                  label={subItem.label}
                  styles={{ input: { cursor: 'pointer' } }}
                />
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
});