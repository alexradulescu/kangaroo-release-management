import { useMemo } from 'react';
import { formatDate } from '../utils';

interface ReleaseMessages {
  message1: string;
  message2: string;
}

export function useReleaseMessages(
  version: string,
  releaseDate: Date,
  jsmopsUrl: string
): ReleaseMessages {
  return useMemo(() => {
    const formattedDate = formatDate(releaseDate);
    
    const message1 = `<Cornea next release security review>

Version to deploy: ${version}
Release Date: ${formattedDate}
JSMOPS Ticket: ${jsmopsUrl}
Github Diff in the JSMOPS ticket automatically generated

@security-reviewers Pls review Cornea above mentioned version. This is a standard release.`;

    const message2 = `<Cornea next version release approval>

Version to deploy: ${version}
Release Date: ${formattedDate}
JSMOPS Ticket: ${jsmopsUrl}
Github Diff in the JSMOPS ticket automatically generated

@techops pls review the next Cornea release`;

    return { message1, message2 };
  }, [version, releaseDate, jsmopsUrl]);
}