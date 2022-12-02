import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { methodNotAllowedError, sendError } from '../../../lib/apiError';

export const BaseURL = 'me/player/';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return sendError(res, methodNotAllowedError(req.method, ['GET']));
  }

  let spotifyRes = await spotifyClient.get(BaseURL, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  res.status(200).json(spotifyRes.data);
}
