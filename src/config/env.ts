// Environment variables with fallbacks
export const ENV = {
  BUILDKITE_URL: import.meta.env.VITE_BUILDKITE_URL || 'https://buildkite.com/',
  OCTOPUS_URL: import.meta.env.VITE_OCTOPUS_URL || 'https://octopus.com/',
  JIRA_URL: import.meta.env.VITE_JIRA_URL || 'https://example.com/',
  JSMOPS_URL_PREFIX: import.meta.env.VITE_JSMOPS_URL_PREFIX || 'https://example.com/',
  SECURITY_SLACK_URL: import.meta.env.VITE_SECURITY_SLACK_URL || 'slack://open',
  TECHOPS_SLACK_URL: import.meta.env.VITE_TECHOPS_SLACK_URL || 'slack://open',
  WEB_SLACK_URL: import.meta.env.VITE_WEB_SLACK_URL || 'slack://open',
  PROD_URL: import.meta.env.VITE_PROD_URL || 'https://example.com/',
  SIMNEXT_URL: import.meta.env.VITE_SIMNEXT_URL || 'https://example.com/',
}

// Check which environment variables are missing
export const getMissingEnvVariables = () => {
  const missingVars = []
  if (!import.meta.env.VITE_BUILDKITE_URL) missingVars.push('BUILDKITE_URL')
  if (!import.meta.env.VITE_OCTOPUS_URL) missingVars.push('OCTOPUS_URL')
  if (!import.meta.env.VITE_JIRA_URL) missingVars.push('JIRA_URL')
  if (!import.meta.env.VITE_JSMOPS_URL_PREFIX) missingVars.push('JSMOPS_URL_PREFIX')
  if (!import.meta.env.VITE_SECURITY_SLACK_URL) missingVars.push('SECURITY_SLACK_URL')
  if (!import.meta.env.VITE_TECHOPS_SLACK_URL) missingVars.push('TECHOPS_SLACK_URL')
  if (!import.meta.env.VITE_WEB_SLACK_URL) missingVars.push('WEB_SLACK_URL')
  if (!import.meta.env.VITE_PROD_URL) missingVars.push('PROD_URL')
  if (!import.meta.env.VITE_SIMNEXT_URL) missingVars.push('SIMNEXT_URL')
  return missingVars
}
