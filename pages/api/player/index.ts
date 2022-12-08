import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { methodNotAllowed, sendError } from '../../../lib/apiError';

export const BaseURL = 'me/player/';

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  let spotifyRes = await spotifyClient.get(BaseURL, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
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
