import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, useSession } from 'next-auth/react';
import httpClient from '../../../httpClient';
import { baseURL } from './index';

export default async function playTrack(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    let spotifyRes = await httpClient.get(`${baseURL}/play`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(200).json(spotifyRes.data);
  } else res.status(405);
}
