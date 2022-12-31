import { useSession } from 'next-auth/react';
import { PartyCode } from '@common/types/partyCode';

/**
 * Gets the party-code from the current session.
 * **Only use this on protected pages**
 */
export function usePartyCode(): PartyCode {
  /*
 Since this component is used on a protected page we can assume,
 that the user is logged in, and we have a session
*/
  const { data, status } = useSession();
  return data!.user.partyCode;
}
