import { GetServerSidePropsContext } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { PartyCode } from '@common/types/partyCode';
import { AuthUser } from '@common/types/next-auth';

/**
 * Functions for interacting with the session **SERVER-SIDE**
 */
export namespace ServersideSession {
  /**
   * Gets the current session. Null if not logged in
   * @param ctx The context. Available in _getServerSideProps_
   */
  export function tryGet(
    ctx: GetServerSidePropsContext
  ): Promise<Session | null> {
    return unstable_getServerSession(ctx.req, ctx.res, authOptions);
  }

  /**
   * Gets the current auth-user. Null if not logged in
   * @param ctx The context. Available in _getServerSideProps_
   */
  export async function tryGetAuthUser(
    ctx: GetServerSidePropsContext
  ): Promise<AuthUser | null> {
    const session = await tryGet(ctx);
    return session?.user ?? null;
  }

  /**
   * Gets the current party-code. Null if not logged in
   * @param ctx The context. Available in _getServerSideProps_
   */
  export async function tryGetPartyCode(
    ctx: GetServerSidePropsContext
  ): Promise<PartyCode | null> {
    const user = await tryGetAuthUser(ctx);
    return user?.partyCode ?? null;
  }
}
