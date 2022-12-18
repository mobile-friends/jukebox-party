import { NextApiHandler, NextApiRequest } from 'next';
import {
  ApiResponse,
  ApiResult,
  CodedResult,
} from '@common/infrastructure/types';
import { methodOf, urlOf } from '@common/util/reqUtil';

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

function tryGetSpotifyToken(req: NextApiRequest): string | null {
  const header = req.headers.authorization;
  if (header == undefined) return null;
  if (header.startsWith('Bearer'))
    return header.split(' ')[1]; // Get rid of the "Bearer"
  else return header;
}

export function requestHandler<TBody, TResult extends ApiResult>(
  handler: HandlerFunc<TBody, TResult>
): NextApiHandler<ApiResponse<TResult>> {
  return async (req, res) => {
    const [result, statusCode] = await handler({
      body: req.body,
      query: req.query,
      spotifyToken: tryGetSpotifyToken(req),
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
