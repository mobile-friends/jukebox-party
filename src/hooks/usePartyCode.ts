import { useSession } from 'next-auth/react';
import { PartyCode } from '@common/types/partyCode';
import { useRouter } from 'next/router';

/**
 * Gets the party-code from the current session.
 * **Only use this on protected pages**
 */
export function usePartyCode(): PartyCode {
  const router = useRouter();
  /*
 Since this hook is used only on protected pages we can assume,
 that the user is logged in, and we have a session.
 If they don't for some reason, just bring them home
 */
  const { data } = useSession({
    required: true,
    async onUnauthenticated() {
      await router.push('/');
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!.user.partyCode;
}
