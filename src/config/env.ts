// Environment variables with fallbacks
export const ENV = {
  BUILDKITE_URL: import.meta.env.VITE_BUILDKITE_URL || 'https://buildkite.com/',
  OCTOPUS_URL: import.meta.env.VITE_OCTOPUS_URL || 'https://octopus.com/',
  JIRA_URL: import.meta.env.VITE_JIRA_URL || 'https://blockone.atlassian.net/',
  JSMOPS_URL_PREFIX: import.meta.env.VITE_JSMOPS_URL_PREFIX || 'https://blockone.atlassian.net/jira/servicedesk/projects/JSMOPS/queues/issue/JSMOPS-',
  SLACK_URL: import.meta.env.VITE_SLACK_URL || 'slack://open',
};

// Check which environment variables are missing
export const getMissingEnvVariables = () => {
  const missingVars = [];
  if (!import.meta.env.VITE_BUILDKITE_URL) missingVars.push('BUILDKITE_URL');
  if (!import.meta.env.VITE_OCTOPUS_URL) missingVars.push('OCTOPUS_URL');
  if (!import.meta.env.VITE_JIRA_URL) missingVars.push('JIRA_URL');
  if (!import.meta.env.VITE_JSMOPS_URL_PREFIX) missingVars.push('JSMOPS_URL_PREFIX');
  if (!import.meta.env.VITE_SLACK_URL) missingVars.push('SLACK_URL');
  return missingVars;
};