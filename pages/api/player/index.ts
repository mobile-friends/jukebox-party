import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    let spotifyRes = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization,
      },
    });
    spotifyRes = await spotifyRes.json();
    res.status(200).json(spotifyRes);
  }
}
