import React, { memo } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { ExternalLink } from 'lucide-react';

interface ExternalLinkButtonProps {
  url: string;
  disabled: boolean;
}

export const ExternalLinkButton = memo(function ExternalLinkButton({ 
  url, 
  disabled 
}: ExternalLinkButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <Tooltip label="Open ticket">
      <ActionIcon
        variant="subtle"
        color="gray"
        onClick={handleClick}
        disabled={disabled}
      >
        <ExternalLink size={16} />
      </ActionIcon>
    </Tooltip>
  );
});