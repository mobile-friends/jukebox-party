import { Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { PartyCode } from '@common/types/partyCode';
import http from 'http';

export type AuthUser = {
  partyCode: PartyCode;
  id: UserId;
};

interface ReqRes {
  req: http.IncomingMessage & { cookies: Partial<{ [p: string]: string }> };
  res: http.ServerResponse<http.IncomingMessage>;
}

/**
 * Functions for interacting with the session **SERVER-SIDE**
 */
export namespace ServersideSession {
  /**
   * Gets the current session. Null if not logged in
   * @param reqRes Request and response objects
   */
  export function tryGet(reqRes: ReqRes): Promise<Session | null> {
    return unstable_getServerSession(reqRes.req, reqRes.res, authOptions);
  }

  /**
   * Gets the current auth-user. Null if not logged in
   * @param reqRes Request and response objects
   */
  export async function tryGetAuthUser(
    reqRes: ReqRes
  ): Promise<AuthUser | null> {
    const session = await tryGet(reqRes);
    return session?.user ?? null;
  }

  /**
   * Gets the current party-code. Null if not logged in
   * @param reqRes Request and response objects
   */
  export async function tryGetPartyCode(
    reqRes: ReqRes
  ): Promise<PartyCode | null> {
    const user = await tryGetAuthUser(reqRes);
    return user?.partyCode ?? null;
  }
}
