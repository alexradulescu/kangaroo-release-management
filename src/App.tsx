import React, { useState } from 'react';
import { Container, TextInput, Stack, Title, Grid } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Notifications, notifications } from '@mantine/notifications';
import { Check } from 'lucide-react';
import { getNextReleaseDate, formatDate } from './utils';
import { MessagePreview } from './components/MessagePreview';

function App() {
  const [version, setVersion] = useState('');
  const [releaseDate, setReleaseDate] = useState<Date>(getNextReleaseDate());
  const [jsmopsTicket, setJsmopsTicket] = useState('');

  const isValidVersion = /^\d+\.\d+\.\d+$/.test(version);
  const isValidUrl = jsmopsTicket.startsWith('http');
  const isFormValid = isValidVersion && releaseDate && isValidUrl;

  const generateMessages = () => {
    const formattedDate = formatDate(releaseDate);
    
    const message1 = `<Cornea next release security review>

Version to deploy: ${version}
Release Date: ${formattedDate}
JSMOPS Ticket: ${jsmopsTicket}
Github Diff in the JSMOPS ticket automatically generated

@security-reviewers Pls review Cornea above mentioned version. This is a standard release.`;

    const message2 = `<Cornea next version release approval>

Version to deploy: ${version}
Release Date: ${formattedDate}
JSMOPS Ticket: ${jsmopsTicket}
Github Diff in the JSMOPS ticket automatically generated

@techops pls review the next Cornea release`;

    return { message1, message2 };
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    notifications.show({
      title: 'Copied to clipboard',
      message: 'Message has been copied and ready to paste in Slack',
      icon: <Check size={16} />,
      color: 'teal',
    });
  };

  const messages = generateMessages();

  return (
    <>
      <Notifications />
      <Container size="sm" py="xl">
        <Stack gap="md">
          <Title order={1} ta="center" mb="md">
            Release Management
          </Title>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Release Version"
                placeholder="e.g., 3.99.1"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                error={version && !isValidVersion ? "Must be in format: digits.digits.digits" : null}
                required
                autoFocus
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <DateInput
                label="Release Date"
                placeholder="Pick a date"
                value={releaseDate}
                onChange={(date) => setReleaseDate(date || getNextReleaseDate())}
                required
                minDate={new Date()}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="JSMOPS Ticket URL"
            placeholder="https://..."
            value={jsmopsTicket}
            onChange={(e) => setJsmopsTicket(e.target.value)}
            error={jsmopsTicket && !isValidUrl ? "Must be a valid URL" : null}
            required
          />

          <Stack gap="md" mt="md">
            <MessagePreview
              title="Security Review Message"
              message={messages.message1}
              onCopy={() => copyToClipboard(messages.message1)}
              disabled={!isFormValid}
            />

            <MessagePreview
              title="Release Approval Message"
              message={messages.message2}
              onCopy={() => copyToClipboard(messages.message2)}
              disabled={!isFormValid}
            />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

export default App;