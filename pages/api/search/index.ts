import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';

export const baseURL = 'search';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    let { q, type } = req.query;
    let spotifyRes = await spotifyClient.get(`${baseURL}?q=${q}&type=${type}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    console.log(spotifyRes.data);
    res.status(200).json(spotifyRes.data);
  }
}
