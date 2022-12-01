import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { BaseURL } from './index';

export default async function playTrack(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  let spotifyRes = await spotifyClient.get(`${BaseURL}/play`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  res.status(200).json(spotifyRes.data);
}
