import { Calendar, Hash } from 'lucide-react'
import React, { useCallback, useMemo } from 'react'

import { Container, Grid, Group, Select, Stack, TextInput, Title } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import { parseAsIsoDate, useQueryState } from 'nuqs'

import { EnvWarning } from './components/EnvWarning'
import { ExternalLinkButton } from './components/ExternalLinkButton'
import { ReleaseChecklist } from './components/ReleaseChecklist'
import { getMissingEnvVariables } from './config/env'
import { useReleaseMessages } from './hooks/useReleaseMessages'
import { getJsmopsUrl, getNextReleaseDate, isValidJsmops, isValidVersion } from './utils'

export const App = () => {
  // Form state
  const [version, setVersion] = useQueryState('version', { defaultValue: '' })
  const [releaseDate, setReleaseDate] = useQueryState(
    'date',
    parseAsIsoDate.withDefault(getNextReleaseDate())
  )
  const [jsmopsNumber, setJsmopsNumber] = useQueryState('jsmops', { defaultValue: '' })
  const [selectedProject, setSelectedProject] = useQueryState('project', { defaultValue: 'Cornea' })

  // Check missing environment variables
  const missingEnvVars = useMemo(() => getMissingEnvVariables(), [])

  // Derived state
  const jsmopsUrl = useMemo(() => getJsmopsUrl(jsmopsNumber), [jsmopsNumber])

  const isFormValid = useMemo(
    () => isValidVersion(version) && releaseDate && isValidJsmops(jsmopsNumber),
    [version, releaseDate, jsmopsNumber]
  )

  // Messages
  const { message1, message2 } = useReleaseMessages(version, releaseDate, jsmopsUrl, selectedProject)

  // Handlers
  const handleVersionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVersion(e.target.value)
    },
    [setVersion]
  )

  const handleDateChange = useCallback(
    (date: Date | null) => {
      setReleaseDate(date || getNextReleaseDate())
    },
    [setReleaseDate]
  )

  const handleJsmopsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setJsmopsNumber(e.target.value)
    },
    [setJsmopsNumber]
  )

  return (
    <>
      <Notifications />
      <Container size='sm' py='xl'>
        <Stack gap='md'>
          <EnvWarning missingVars={missingEnvVars} />

          <Group justify='space-between' align='baseline'>
            <Title order={2}>Release Management</Title>
          </Group>

          <Grid gutter='md'>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label='Project'
                value={selectedProject}
                onChange={value => setSelectedProject(value || 'Cornea')}
                data={[
                  { value: 'Cornea', label: 'Cornea' },
                  { value: 'Ctrl-UI', label: 'Ctrl-UI' },
                ]}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput
                label='Release Version'
                placeholder='e.g. 3.99.1'
                value={version}
                onChange={handleVersionChange}
                error={version && !isValidVersion(version) ? 'Must be in format: digits.digits.digits' : null}
                required
                autoFocus
                rightSection={<Hash size='14' />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <DateInput
                label='Release Date'
                placeholder='Pick a date'
                value={releaseDate}
                onChange={handleDateChange}
                required
                minDate={new Date()}
                valueFormat='DD MMM YYYY'
                rightSection={<Calendar size='14' />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput
                label='JSMOPS Number'
                placeholder='e.g. 12345'
                value={jsmopsNumber}
                onChange={handleJsmopsChange}
                error={jsmopsNumber && !isValidJsmops(jsmopsNumber) ? 'Must be a valid number' : null}
                required
                rightSection={<ExternalLinkButton url={jsmopsUrl} disabled={!isValidJsmops(jsmopsNumber)} />}
              />
            </Grid.Col>
          </Grid>

          <Stack gap='xs' mt='sm'>
            <ReleaseChecklist message1={message1} message2={message2} disabled={!isFormValid} />
          </Stack>
        </Stack>
      </Container>
    </>
  )
}
