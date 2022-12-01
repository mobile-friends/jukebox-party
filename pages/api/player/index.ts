import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';

export const BaseURL = 'me/player/';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  let spotifyRes = await spotifyClient.get(BaseURL, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  res.status(200).json(spotifyRes.data);
}
