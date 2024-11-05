import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { Check } from 'lucide-react';
import { ENV } from '../config/env';

export function useClipboard() {
  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    notifications.show({
      title: 'Copied to clipboard',
      message: 'Message has been copied and ready to paste in Slack',
      icon: <Check size={16} />,
      color: 'teal',
    });
  }, []);

  const openSlack = useCallback(() => {
    window.open(ENV.SLACK_URL, '_blank');
  }, []);

  return { copyToClipboard, openSlack };
}