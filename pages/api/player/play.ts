import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { BaseURL } from './index';
import { methodNotAllowed, sendError } from '../../../lib/apiError';

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  let spotifyRes = await spotifyClient.get(`${BaseURL}/play`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  res.status(200).json(spotifyRes.data);
}

export default async function playTrack(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    return await handlePut(req, res);
  }

  return sendError(req, res, methodNotAllowed(['PUT']));
}
