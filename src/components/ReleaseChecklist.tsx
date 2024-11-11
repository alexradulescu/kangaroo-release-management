import { RefreshCw } from 'lucide-react'
import React, { memo, useCallback, useState } from 'react'

import { Accordion, Box, Button, Group, Stack, Text } from '@mantine/core'

import { ENV } from '../config/env'
import { ChecklistItem } from './ChecklistItem'

interface SubItem {
  id: string
  label: string
}

interface ChecklistItemData {
  id: string
  label: string
  description?: string
  section: string
  link?: string
  slackLink?: string
  showMessageActions?: boolean
  subItems?: SubItem[]
}

interface ReleaseChecklistProps {
  message1: string
  message2: string
  disabled: boolean
}

const CHECKLIST_ITEMS: ChecklistItemData[] = [
  // Pre-Release Steps
  {
    id: 'buildkite',
    label: 'Trigger all steps in Buildkite',
    description:
      'Trigger all of them at once, they will sun sequentially anyway and come back 10-15 min later',
    section: 'Pre-Release Steps',
    link: ENV.BUILDKITE_URL,
  },
  {
    id: 'jsmops',
    label: 'Update details in JSMOPS ticket',
    description:
      '• Update Release start & end date • Set Release manager • Set Vault changes to No • Update ticket status • Assign ticket to yourself • Update risk assessment',
    section: 'Pre-Release Steps',
    link: ENV.JIRA_URL,
  },

  // Communication
  {
    id: 'security-message',
    label: 'Post Security Review Message in Slack',
    section: 'Communication',
    showMessageActions: true,
    slackLink: ENV.SECURITY_SLACK_URL,
  },
  {
    id: 'approval-message',
    label: 'Post Release Approval Message in Slack',
    section: 'Communication',
    showMessageActions: true,
    slackLink: ENV.TECHOPS_SLACK_URL,
  },

  // Simnext Deployment
  {
    id: 'dev-confirm',
    label: 'Verify the developers confirmed their changes',
    description: 'And that jira tickets have proof',
    section: 'Simnext Deployment',
    link: ENV.WEB_SLACK_URL,
  },
  {
    id: 'simnext-deploy',
    label: 'Deploy to Simnext using OctopusDeploy',
    section: 'Simnext Deployment',
    link: ENV.OCTOPUS_URL,
  },
  {
    id: 'simnext-sanity',
    label: 'Sanity check in Simnext',
    description: 'Perform basic functionality checks in Simnext',
    section: 'Simnext Deployment',
    link: ENV.PROD_URL,
    subItems: [
      { id: 'simnext-login', label: 'Login' },
      {
        id: 'simnext-navigation',
        label: 'Check that all the pages load up correctly',
      },
      { id: 'simnext-trade', label: 'Basic trade & AMM' },
      { id: 'simnext-simpleui', label: 'Check simple UI pages also' },
      {
        id: 'simnext-featureflags',
        label: 'Check no unexpected features are enabled, visually',
      },
      { id: 'simnext-accounts', label: 'Switch trading accounts' },
    ],
  },

  // Prod Deployment
  {
    id: 'prod-deploy',
    label: 'Deploy to PROD via OctopusDeploy',
    description: 'Remember to put in the JSMOPS number',
    section: 'Prod Deployment',
    link: ENV.OCTOPUS_URL,
  },
  {
    id: 'prod-sanity',
    label: 'Perform sanity check in PROD',
    description:
      '⚠️ If sanity check fails, ping @webeng and @techops immediately and start simnext rollback to previous prod version.',
    section: 'Prod Deployment',
    link: ENV.PROD_URL,
    subItems: [
      { id: 'prod-login', label: 'Login' },
      {
        id: 'prod-navigation',
        label: 'Check that all the pages load up correctly',
      },
      { id: 'prod-simpleui', label: 'Check simple UI pages also' },
      {
        id: 'prod-featureflags',
        label: 'Check no unexpected features are enabled, visually',
      },
      { id: 'prod-accounts', label: 'Switch trading accounts' },
    ],
  },
  {
    id: 'slack-complete',
    label: 'Post message on slack about release completed',
    section: 'Prod Deployment',
    link: ENV.WEB_SLACK_URL,
  },
]

export const ReleaseChecklist = memo(function ReleaseChecklist({
  message1,
  message2,
  disabled,
}: ReleaseChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [checkedSubItems, setCheckedSubItems] = useState<string[]>([])

  const handleToggle = useCallback((id: string) => {
    setCheckedItems(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
  }, [])

  const handleSubItemToggle = useCallback((subId: string) => {
    setCheckedSubItems(prev =>
      prev.includes(subId) ? prev.filter(item => item !== subId) : [...prev, subId]
    )
  }, [])

  const resetChecklist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCheckedItems([])
    setCheckedSubItems([])
  }, [])

  const sections = Array.from(new Set(CHECKLIST_ITEMS.map(item => item.section)))
  const completedCount = checkedItems.length
  const totalCount = CHECKLIST_ITEMS.length

  return (
    <Accordion
      defaultValue='checklist'
      variant='contained'
      style={
        disabled
          ? {
              pointerEvents: 'none',
              opacity: '0.6',
              filter: 'grayscale(1) blur(2px)',
              transition: 'opacity .25s, filter .25s',
            }
          : { transition: 'opacity .25s, filter .25s' }
      }
    >
      <Accordion.Item value='checklist'>
        <Accordion.Control>
          <Group justify='space-between' wrap='nowrap' style={{ width: '100%' }} pr='sm'>
            <Text fw={500}>Release Checklist</Text>
            <Group gap='xs'>
              <Text size='sm' c={completedCount === totalCount ? 'green' : 'dimmed'}>
                ({completedCount} / {totalCount}
                <Box display={{ md: 'inline', base: 'none' }}> completed</Box>)
              </Text>
              <Button
                variant='subtle'
                color='red'
                size='xs'
                onClick={resetChecklist}
                leftSection={<RefreshCw size={16} />}
              >
                <Box display={{ base: 'none', sm: 'block' }}>Reset</Box>
              </Button>
            </Group>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap='md'>
            {sections.map(section => (
              <div key={section}>
                <Text fw={500} c='dimmed' mb='xs'>
                  {section}
                </Text>
                <Stack gap={0}>
                  {CHECKLIST_ITEMS.filter(item => item.section === section).map((item, index, array) => (
                    <ChecklistItem
                      key={item.id}
                      {...item}
                      checked={checkedItems.includes(item.id)}
                      message={
                        item.id === 'security-message'
                          ? message1
                          : item.id === 'approval-message'
                            ? message2
                            : undefined
                      }
                      isLastInSection={index === array.length - 1}
                    />
                  ))}
                </Stack>
              </div>
            ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
})
