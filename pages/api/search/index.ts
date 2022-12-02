import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { tryQueryParam } from '../../../lib/query';
import { methodNotAllowedError, sendError } from '../../../lib/apiError';

export const BaseURL = 'search';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return sendError(
      res,
      methodNotAllowedError('/search', req.method, ['GET'])
    );
  }

  const query = tryQueryParam(req.query, 'q');
  if (query === null) {
    res.status(400).json({ message: 'Missing q parameter' });
    return;
  }

  const type = tryQueryParam(req.query, 'type');
  if (type === null) {
    res.status(400).json({ message: 'Missing type parameter' });
    return;
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
