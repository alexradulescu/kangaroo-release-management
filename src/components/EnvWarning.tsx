import React, { memo } from 'react';
import { Alert, Text } from '@mantine/core';
import { AlertTriangle } from 'lucide-react';

interface EnvWarningProps {
  missingVars: string[];
}

export const EnvWarning = memo(function EnvWarning({ missingVars }: EnvWarningProps) {
  if (missingVars.length === 0) return null;

  return (
    <Alert 
      icon={<AlertTriangle size={16} />} 
      color="yellow" 
      variant="light"
      title="Development Mode"
    >
      <Text size="sm">
        Running with mock URLs. Missing environment variables: {missingVars.join(', ')}
      </Text>
    </Alert>
  );
});