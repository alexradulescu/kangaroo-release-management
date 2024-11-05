import React, { useState, useCallback, useMemo } from 'react';
import { Container, TextInput, Stack, Title, Grid, Group, Anchor } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { MessageAccordion } from './components/MessageAccordion';
import { ReleaseChecklist } from './components/ReleaseChecklist';
import { ExternalLinkButton } from './components/ExternalLinkButton';
import { EnvWarning } from './components/EnvWarning';
import { useReleaseMessages } from './hooks/useReleaseMessages';
import { EXTERNAL_LINKS } from './constants';
import { getMissingEnvVariables } from './config/env';
import { 
  isValidVersion, 
  isValidJsmops, 
  getJsmopsUrl, 
  getNextReleaseDate 
} from './utils';

export default function App() {
  // Form state
  const [version, setVersion] = useState('');
  const [releaseDate, setReleaseDate] = useState(getNextReleaseDate());
  const [jsmopsNumber, setJsmopsNumber] = useState('');

  // Check missing environment variables
  const missingEnvVars = useMemo(() => getMissingEnvVariables(), []);

  // Derived state
  const jsmopsUrl = useMemo(() => 
    getJsmopsUrl(jsmopsNumber), [jsmopsNumber]
  );

  const isFormValid = useMemo(() => 
    isValidVersion(version) && releaseDate && isValidJsmops(jsmopsNumber),
    [version, releaseDate, jsmopsNumber]
  );

  // Messages
  const { message1, message2 } = useReleaseMessages(version, releaseDate, jsmopsUrl);

  // Handlers
  const handleVersionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVersion(e.target.value);
  }, []);

  const handleDateChange = useCallback((date: Date | null) => {
    setReleaseDate(date || getNextReleaseDate());
  }, []);

  const handleJsmopsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setJsmopsNumber(e.target.value);
  }, []);

  return (
    <>
      <Notifications />
      <Container size="sm" py="xl">
        <Stack gap="md">
          <EnvWarning missingVars={missingEnvVars} />
          
          <Group justify="space-between" align="baseline">
            <Title order={1}>Release Management</Title>
            <Group gap="md">
              {EXTERNAL_LINKS.map(({ label, url }) => (
                <Anchor
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  color="teal"
                  underline="always"
                >
                  {label}
                </Anchor>
              ))}
            </Group>
          </Group>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Release Version"
                placeholder="e.g., 3.99.1"
                value={version}
                onChange={handleVersionChange}
                error={version && !isValidVersion(version) ? "Must be in format: digits.digits.digits" : null}
                required
                autoFocus
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DateInput
                label="Release Date"
                placeholder="Pick a date"
                value={releaseDate}
                onChange={handleDateChange}
                required
                minDate={new Date()}
                valueFormat="DD MMM YYYY"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="JSMOPS Ticket Number"
                placeholder="Enter ticket number"
                value={jsmopsNumber}
                onChange={handleJsmopsChange}
                error={jsmopsNumber && !isValidJsmops(jsmopsNumber) ? "Must be a valid number" : null}
                required
                rightSection={
                  <ExternalLinkButton 
                    url={jsmopsUrl}
                    disabled={!isValidJsmops(jsmopsNumber)}
                  />
                }
              />
            </Grid.Col>
          </Grid>

          <Stack gap="xs" mt="sm">
            <MessageAccordion
              title="Security Review Message"
              message={message1}
              disabled={!isFormValid}
            />

            <MessageAccordion
              title="Release Approval Message"
              message={message2}
              disabled={!isFormValid}
            />
            
            <ReleaseChecklist />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}