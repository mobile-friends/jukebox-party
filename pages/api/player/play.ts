import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { BaseURL } from './index';
import { methodNotAllowedError, sendError } from '../../../lib/apiError';

export default async function playTrack(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return sendError(res, methodNotAllowedError(req.method, ['PUT']));
  }

  let spotifyRes = await spotifyClient.get(`${BaseURL}/play`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  res.status(200).json(spotifyRes.data);
}
