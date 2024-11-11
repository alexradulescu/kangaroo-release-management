import { ChevronDown, Copy, ExternalLink, MessageSquare, Slack } from 'lucide-react'
import { Check } from 'lucide-react'
import React, { memo } from 'react'

import { Box, Button, Checkbox, Group, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { useChecklistStore } from '../stores/checkListStore'

interface SubItem {
  id: string
  label: string
}

interface ChecklistItemProps {
  id: string
  label: string
  description?: string
  link?: string
  slackLink?: string
  showMessageActions?: boolean
  message?: string
  checked: boolean
  subItems?: SubItem[]
  isLastInSection?: boolean
  disabled: boolean
}

export const ChecklistItem = memo(function ChecklistItem({
  id,
  label,
  description,
  link,
  slackLink,
  showMessageActions,
  message,
  subItems,
  isLastInSection = false,
  disabled,
}: ChecklistItemProps) {
  const [expanded, setExpanded] = React.useState(false)
  const { checkedItems, checkedSubItems, toggleItem, toggleSubItem } = useChecklistStore()

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (message) {
      await navigator.clipboard.writeText(message)
      notifications.show({
        title: 'Copied to clipboard',
        message: 'Message has been copied and ready to paste in Slack',
        icon: <Check size={16} />,
        color: 'teal',
      })
    }
  }

  const openLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(link, '_blank')
  }

  const openSlack = (e: React.MouseEvent, slackLink?: string) => {
    e.stopPropagation()
    window.open(slackLink, '_blank')
  }

  const copyAndSlack = async (e: React.MouseEvent, slackLink?: string) => {
    await copyToClipboard(e)
    openSlack(e, slackLink)
  }

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <Box
      py='xs'
      style={{
        borderBottom: isLastInSection ? 'none' : '1px solid var(--mantine-color-dark-4)',
      }}
    >
      <Stack gap='xs'>
        <Group justify='space-between' wrap='nowrap' w='100%'>
          <Group gap='md' wrap='nowrap' style={{ flex: 1 }}>
            <Checkbox
              checked={checkedItems.includes(id)}
              onChange={() => toggleItem(id)}
              styles={{ input: { cursor: 'pointer' } }}
              disabled={disabled}
              label={
                <Stack gap={4}>
                  <Text size='sm' style={{ cursor: 'default' }}>
                    {label}
                  </Text>
                  {description && (
                    <Text size='xs' c='dimmed'>
                      {description}
                    </Text>
                  )}
                </Stack>
              }
            />
          </Group>

          <Button.Group>
            {link && (
              <Button
                variant='subtle'
                color='blue'
                size='xs'
                onClick={openLink}
                leftSection={<ExternalLink size={14} />}
                disabled={disabled}
              >
                <Box display={{ base: 'none', sm: 'block' }}>Open</Box>
              </Button>
            )}
            {showMessageActions && message && (
              <>
                <Button
                  variant='subtle'
                  color='blue'
                  size='xs'
                  onClick={(e: React.MouseEvent) => copyAndSlack(e, slackLink)}
                  leftSection={<MessageSquare size={14} />}
                  disabled={disabled}
                >
                  <Box display={{ base: 'none', sm: 'block' }}>Copy & Slack</Box>
                </Button>
                <Button
                  variant='subtle'
                  color='gray'
                  size='xs'
                  onClick={copyToClipboard}
                  leftSection={<Copy size={14} />}
                  disabled={disabled}
                >
                  <Box display={{ base: 'none', sm: 'block' }}>Copy</Box>
                </Button>
                <Button
                  variant='subtle'
                  color='gray'
                  size='xs'
                  onClick={(e: React.MouseEvent) => openSlack(e, slackLink)}
                  leftSection={<Slack size={14} />}
                  disabled={disabled}
                >
                  <Box display={{ base: 'none', sm: 'block' }}>Slack</Box>
                </Button>
              </>
            )}
            {subItems && (
              <Button
                variant='subtle'
                color='gray'
                size='xs'
                onClick={toggleExpand}
                rightSection={<ChevronDown size={14} />}
                disabled={disabled}
              >
                <Box display={{ base: 'none', sm: 'block' }}>{expanded ? 'Hide Steps' : 'Show Steps'}</Box>
              </Button>
            )}
          </Button.Group>
        </Group>

        {expanded && subItems && (
          <Stack gap='xs' ml={48}>
            {subItems.map(subItem => (
              <Group key={subItem.id} gap='md'>
                <Checkbox
                  size='xs'
                  checked={checkedSubItems.includes(subItem.id)}
                  onChange={() => toggleSubItem(subItem.id)}
                  label={subItem.label}
                  styles={{ input: { cursor: 'pointer' } }}
                  disabled={disabled}
                />
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  )
})
