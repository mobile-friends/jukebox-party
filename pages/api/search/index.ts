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
    return sendError(req, res, methodNotAllowed(['GET']));
  }

  const query = tryQueryParam(req.query, 'q');
  if (query === null) {
    return sendError(req, res, missingQueryParam('q'));
  }

  const type = tryQueryParam(req.query, 'type');
  if (type === null) {
    return sendError(req, res, missingQueryParam('type'));
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
