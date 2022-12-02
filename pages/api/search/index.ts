import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { tryQueryParam } from '../../../lib/query';
import {
  methodNotAllowed,
  missingQueryParam,
  sendError,
} from '../../../lib/apiError';

export const BaseURL = 'search';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return sendError(res, methodNotAllowed('/search', req.method, ['GET']));
  }

  const query = tryQueryParam(req.query, 'q');
  if (query === null) {
    return sendError(res, missingQueryParam('/search', req.method, 'q'));
  }

  const type = tryQueryParam(req.query, 'type');
  if (type === null) {
    return sendError(res, missingQueryParam('/search', req.method, 'type'));
  }

  const spotifyRes = await spotifyClient.get(
    `${BaseURL}?q=${query}&type=${type}`,
    {
      headers: {
        Authorization: req?.headers?.authorization,
      },
    }
  );
  res.status(200).json(spotifyRes.data);
}
