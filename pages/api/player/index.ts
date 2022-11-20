import { NextApiRequest, NextApiResponse } from 'next';
import httpClient from '../../../httpClient';

export const baseURL = 'me/player/';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    let spotifyRes = await httpClient.get(baseURL, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(200).json(spotifyRes.data);
  }
}
