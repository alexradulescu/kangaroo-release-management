import React, { useState, useCallback, memo } from 'react';
import { Accordion, Stack, Text, Group, Button } from '@mantine/core';
import { ENV } from '../config/env';
import { ChecklistItem } from './ChecklistItem';

interface SubItem {
  id: string;
  label: string;
}

interface ChecklistItemData {
  id: string;
  label: string;
  description?: string;
  section: string;
  link?: string;
  showMessageActions?: boolean;
  subItems?: SubItem[];
}

interface ReleaseChecklistProps {
  selectedProject: string;
  message1: string;
  message2: string;
}

const CHECKLIST_ITEMS: ChecklistItemData[] = [
  // Pre-Release Steps
  { 
    id: 'buildkite', 
    label: 'Trigger all steps in Buildkite', 
    description: 'Ensure all build steps complete successfully before proceeding',
    section: 'Pre-Release Steps',
    link: ENV.BUILDKITE_URL,
  },
  { 
    id: 'jsmops', 
    label: 'Update details in JSMOPS ticket', 
    description: '• Update Release date\n• Set Release manager\n• Set Vault changes to No\n• Update ticket status',
    section: 'Pre-Release Steps',
    link: ENV.JIRA_URL,
  },
  
  // Communication
  { 
    id: 'security-message', 
    label: 'Post Security Review Message in Slack', 
    description: 'Request security team review of the release changes',
    section: 'Communication',
    showMessageActions: true
  },
  { 
    id: 'approval-message', 
    label: 'Post Release Approval Message in Slack', 
    description: 'Request final approval from the release team',
    section: 'Communication',
    showMessageActions: true
  },
  
  // Simnext Deployment
  { 
    id: 'dev-confirm', 
    label: 'Verify the developers confirmed their changes', 
    description: 'Check that all developers have signed off on their changes',
    section: 'Simnext Deployment',
    link: ENV.SLACK_URL,
  },
  { 
    id: 'simnext-deploy', 
    label: 'Deploy to Simnext using OctopusDeploy', 
    description: 'Execute the deployment process in Octopus Deploy',
    section: 'Simnext Deployment',
    link: ENV.OCTOPUS_URL,
  },
  { 
    id: 'simnext-sanity', 
    label: 'Sanity check in Simnext', 
    description: 'Perform basic functionality checks in Simnext',
    section: 'Simnext Deployment',
    link: 'https://simnext.example.com',
    subItems: [
      { id: 'simnext-login', label: 'Verify login functionality' },
      { id: 'simnext-search', label: 'Test search functionality' },
      { id: 'simnext-reports', label: 'Check report generation' },
      { id: 'simnext-api', label: 'Verify API endpoints' }
    ]
  },
  
  // Prod Deployment
  { 
    id: 'prod-deploy', 
    label: 'Deploy to PROD via OctopusDeploy', 
    description: 'Execute the production deployment process',
    section: 'Prod Deployment',
    link: ENV.OCTOPUS_URL,
  },
  { 
    id: 'prod-sanity', 
    label: 'Perform sanity check in PROD', 
    description: 'Complete thorough testing of critical functionality',
    section: 'Prod Deployment',
    link: 'https://prod.example.com',
    subItems: [
      { id: 'prod-login', label: 'Verify login functionality' },
      { id: 'prod-search', label: 'Test search functionality' },
      { id: 'prod-reports', label: 'Check report generation' },
      { id: 'prod-api', label: 'Verify API endpoints' },
      { id: 'prod-monitoring', label: 'Check monitoring dashboards' }
    ]
  },
  { 
    id: 'slack-complete', 
    label: 'Post message on slack about release completed', 
    description: 'Notify all stakeholders of successful deployment',
    section: 'Prod Deployment',
    link: ENV.SLACK_URL,
  },
];

export const ReleaseChecklist = memo(function ReleaseChecklist({ 
  selectedProject,
  message1,
  message2
}: ReleaseChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [checkedSubItems, setCheckedSubItems] = useState<string[]>([]);

  const handleToggle = useCallback((id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const handleSubItemToggle = useCallback((parentId: string, subId: string) => {
    setCheckedSubItems(prev => 
      prev.includes(subId)
        ? prev.filter(item => item !== subId)
        : [...prev, subId]
    );
  }, []);

  const resetChecklist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedItems([]);
    setCheckedSubItems([]);
  }, []);

  const sections = Array.from(new Set(CHECKLIST_ITEMS.map(item => item.section)));
  const completedCount = checkedItems.length;
  const totalCount = CHECKLIST_ITEMS.length;

  return (
    <Accordion defaultValue="checklist" variant="contained">
      <Accordion.Item value="checklist">
        <Accordion.Control>
          <Group justify="space-between" wrap="nowrap" style={{ width: '100%' }} pr='sm'>
            <Text fw={500}>Release Checklist</Text>
            <Group gap="xs">
              <Text size="sm" c={completedCount === totalCount ? "green" : "dimmed"}>
                ({completedCount} / {totalCount} completed)
              </Text>
              <Button 
                variant="subtle" 
                color="red" 
                size="xs"
                onClick={resetChecklist}
              >
                Reset
              </Button>
            </Group>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="md">
            {sections.map(section => (
              <div key={section}>
                <Text fw={500} c="dimmed" mb="xs">{section}</Text>
                <Stack gap={0}>
                  {CHECKLIST_ITEMS
                    .filter(item => item.section === section)
                    .map((item, index, array) => (
                      <ChecklistItem
                        key={item.id}
                        {...item}
                        checked={checkedItems.includes(item.id)}
                        onToggle={handleToggle}
                        onSubItemToggle={handleSubItemToggle}
                        checkedSubItems={checkedSubItems}
                        message={item.id === 'security-message' ? message1 : item.id === 'approval-message' ? message2 : undefined}
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
  );
});