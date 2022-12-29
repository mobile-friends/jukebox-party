import { NextApiHandler } from 'next';
import { ApiResult } from '@common/infrastructure/types';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';

export type Query = { [key: string]: string | string[] | undefined };

export type NoBody = {};

interface Request<TBody> {
  spotifyToken: SpotifyToken | null;
  body: TBody;
  query: Query;
}

type HandlerFunc<TBody, TResult extends ApiResult> = (
  req: Request<TBody>
) => SyncOrAsync<TResult>;

export function requestHandler<TBody, TResult extends ApiResult>(
  handler: HandlerFunc<TBody, TResult>
): NextApiHandler {
  return async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const partyCode = session ? session.user.partyCode : null;
    const party = partyCode
      ? await PartyDb.tryGetByCode(firebaseDb, partyCode)
      : null;
    const spotifyToken =
      party !== null && !PartyDb.isError(party) ? party.spotifyToken : null;
    const result = await handler({
      body: req.body,
      query: req.query,
      spotifyToken,
    });
    res.status(result.code).json(result);
  };
}
