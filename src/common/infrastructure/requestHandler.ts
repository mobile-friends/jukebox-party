import { NextApiHandler } from 'next';
import { ApiResult } from '@common/infrastructure/types';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { StatusCodes } from 'http-status-codes';
import { AuthUser, ServersideSession } from '@common/serversideSession';
import { Party } from '@common/types/party';
import { SpotifyAuthData } from '@common/types/spotifyAuthData';
import axios from 'axios';
import { Env } from '@common/env';

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

interface RefreshResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

async function refreshTokenFor(party: Party): Promise<SpotifyToken> {
  const authHeader =
    'Basic ' +
    new Buffer(
      Env.spotifyClientId() + ':' + Env.spotifyClientSecret()
    ).toString('base64');
  const res = await axios.post<RefreshResponse>(
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'refresh_token',
      refresh_token: party.spotifyAuthData.refreshToken,
    },
    {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const newParty = Party.refreshAuthData(
    party,
    res.data.access_token as SpotifyToken
  );
  await PartyDb.store(firebaseDb, newParty);
  return newParty.spotifyAuthData.accessToken;
}

async function tryGetSpotifyTokenFor({
  partyCode,
  id,
}: AuthUser): Promise<SpotifyToken | null> {
  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);

  if (PartyDb.isError(party) || !Party.hasUserWithId(party, id)) return null;

  if (SpotifyAuthData.isExpired(party.spotifyAuthData))
    return await refreshTokenFor(party);
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
