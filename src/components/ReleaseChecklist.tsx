import React, { useState, useCallback, memo } from 'react';
import { Accordion, Checkbox, Stack, Text, Group, Button } from '@mantine/core';

interface ChecklistItem {
  id: string;
  label: string;
  section: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Pre-Release Steps
  { id: 'buildkite', label: 'Trigger all steps in Buildkite', section: 'Pre-Release Steps' },
  { id: 'jsmops', label: 'Update details in JSMOPS ticket', section: 'Pre-Release Steps' },
  
  // Communication
  { id: 'security-message', label: 'Post Security Review Message in Slack', section: 'Communication' },
  { id: 'approval-message', label: 'Post Release Approval Message in Slack', section: 'Communication' },
  
  // Simnext Deployment
  { id: 'dev-confirm', label: 'Verify the developers confirmed their changes', section: 'Simnext Deployment' },
  { id: 'simnext-deploy', label: 'Deploy to Simnext using OctopusDeploy', section: 'Simnext Deployment' },
  { id: 'simnext-sanity', label: 'Sanity check in Simnext', section: 'Simnext Deployment' },
  
  // Prod Deployment
  { id: 'prod-deploy', label: 'Deploy to PROD via OctopusDeploy', section: 'Prod Deployment' },
  { id: 'prod-sanity', label: 'Perform sanity check in PROD', section: 'Prod Deployment' },
  { id: 'slack-complete', label: 'Post message on slack about release completed', section: 'Prod Deployment' },
];

export const ReleaseChecklist = memo(function ReleaseChecklist() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleToggle = useCallback((id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const resetChecklist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedItems([]);
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
              <Text size="sm" c={completedCount === totalCount ? "green" : "dimmed"}>({completedCount} / {totalCount} completed)</Text>
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
                <Stack gap="xs">
                  {CHECKLIST_ITEMS
                    .filter(item => item.section === section)
                    .map(item => (
                      <Checkbox
                        key={item.id}
                        label={item.label}
                        checked={checkedItems.includes(item.id)}
                        onChange={() => handleToggle(item.id)}
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