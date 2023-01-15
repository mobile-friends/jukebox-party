import { NextApiHandler } from 'next';
import { ApiResult } from '@common/infrastructure/types';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { StatusCodes } from 'http-status-codes';
import { AuthUser, ServersideSession } from '@common/serversideSession';
import { Party } from '@common/types/party';

export type Query = { [key: string]: string | string[] | undefined };

export type NoBody = Record<string, never>;

interface Request<TBody> {
  spotifyToken: SpotifyToken | null;
  body: TBody;
  query: Query;
}

type HandlerFunc<TBody, TResult extends ApiResult> = (
  req: Request<TBody>
) => SyncOrAsync<TResult>;

async function tryGetSpotifyTokenFor({
  partyCode,
  id,
}: AuthUser): Promise<SpotifyToken | null> {
  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);

  if (PartyDb.isError(party) || !Party.hasUserWithId(party, id)) return null;
  return party.spotifyAuthData.accessToken;
}

export function requestHandler<TBody, TResult extends ApiResult>(
  handler: HandlerFunc<TBody, TResult>
): NextApiHandler {
  return async (req, res) => {
    const authUser = await ServersideSession.tryGetAuthUser({ req, res });
    const spotifyToken =
      authUser !== null ? await tryGetSpotifyTokenFor(authUser) : null;
    const { code, ...body } = await handler({
      body: req.body,
      query: req.query,
      spotifyToken,
    });
    res.status(code);
    if (code !== StatusCodes.NO_CONTENT) {
      res.json(body);
    } else res.send(null);
  };
}
