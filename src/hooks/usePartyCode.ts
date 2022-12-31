import { useSession } from 'next-auth/react';
import { PartyCode } from '@common/types/partyCode';
import { useRouter } from 'next/router';

/**
 * Gets the party-code from the current session.
 * **Only use this on protected pages**
 */
export function usePartyCode(): PartyCode {
  /*
   Since this component is used on a protected page we can assume,
   that the user is logged in, and we have a session.
   If they don't for some reason, just bring them home
   */
  const { data, status } = useSession({
    required: true,
    async onUnauthenticated() {
      const router = useRouter();
      await router.push('/');
    },
  });
  return data!.user.partyCode;
}
