import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, useSession } from 'next-auth/react';

export default async function playTrack(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    let spotifyRes = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization,
      },
    });
    spotifyRes = await spotifyRes.json();
    console.log(spotifyRes);
    res.status(204);
    //res.status(204).write(spotifyRes);
    //res.status(204).body(spotifyRes);
  } else res.status(405);
}
