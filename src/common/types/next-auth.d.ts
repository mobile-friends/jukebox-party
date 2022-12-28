import { PartyCode } from '@common/types/partyCode';
import { DefaultUser, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }

  interface User {
    partyCode: PartyCode;
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}
