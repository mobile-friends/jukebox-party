import { NextApiHandler } from 'next';
import {
  ApiResponse,
  ApiResult,
  CodedResult,
} from '@common/infrastructure/types';
import { methodOf, urlOf } from '@common/util/reqUtil';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';

type SyncOrAsync<T> = T | Promise<T>;

export type Query = { [key: string]: string | string[] | undefined };

export type NoBody = {};

interface Request<TBody> {
  spotifyToken: string | null;
  body: TBody;
  query: Query;
}

type HandlerFunc<TBody, TResult extends ApiResult> = (
  req: Request<TBody>
) => SyncOrAsync<CodedResult<TResult>>;

export function requestHandler<TBody, TResult extends ApiResult>(
  handler: HandlerFunc<TBody, TResult>
): NextApiHandler<ApiResponse<TResult>> {
  return async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const partyCode = session ? session.user.partyCode : null;
    const party = partyCode
      ? await PartyDb.tryGetByCode(firebaseDb, partyCode)
      : null;
    const spotifyToken =
      party !== null && !PartyDb.isError(party) ? party.spotifyToken : null;
    const [result, statusCode] = await handler({
      body: req.body,
      query: req.query,
      spotifyToken,
    });
    const responseBody = {
      endpoint: urlOf(req),
      method: methodOf(req) ?? 'Unknown method',
      statusCode,
      data: result,
    } as ApiResponse<TResult>; // TODO: Potentially bad cast, but idk how to fix error
    res.status(statusCode).json(responseBody);
  };
}
