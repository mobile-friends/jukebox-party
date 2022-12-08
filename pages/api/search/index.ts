import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { tryQueryParam } from '../../../lib/query';
import {
  methodNotAllowed,
  missingParam,
  sendError,
} from '../../../lib/apiError';

export const BaseURL = 'search';

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const query = tryQueryParam(req.query, 'q');
  if (query === null) {
    return sendError(req, res, missingParam('q'));
  }

  const type = tryQueryParam(req.query, 'type');
  if (type === null) {
    return sendError(req, res, missingParam('type'));
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return await handleGet(req, res);
  }
  return sendError(req, res, methodNotAllowed(['GET']));
}
