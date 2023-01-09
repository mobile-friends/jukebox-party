// noinspection JSUnusedGlobalSymbols

import { PartyCode } from '@common/types/partyCode';
import { User } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }

  interface User {
    partyCode: PartyCode;
    id: UserId;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}
