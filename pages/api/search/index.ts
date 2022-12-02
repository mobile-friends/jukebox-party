import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { tryQueryParam } from '../../../lib/query';

export const BaseURL = 'search';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const query = tryQueryParam(req.query, 'q');
  if (query === null) {
    res.status(400).json({ message: 'Missing q parameter' });
    return;
  }

  const type = tryQueryParam(req.query, 'type');
  if (type === null) {
    res.status(400).json({ message: 'Missing type parameter' });
    return;
  }

  const spotifyRes = await spotifyClient.get(
    `${BaseURL}?q=${query}&type=${type}`,
    {
      headers: {
        Authorization: req?.headers?.authorization,
      },
    }
  );
  res.status(200).json(spotifyRes.data);
}
