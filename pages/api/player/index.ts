import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';

export const baseURL = 'me/player/';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    let spotifyRes = await spotifyClient.get(baseURL, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(200).json(spotifyRes.data);
  }
}
