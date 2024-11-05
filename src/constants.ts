import { ENV } from './config/env';

export const EXTERNAL_LINKS = [
  { label: 'Buildkite', url: ENV.BUILDKITE_URL },
  { label: 'Octopus', url: ENV.OCTOPUS_URL },
  { label: 'Jira', url: ENV.JIRA_URL },
];