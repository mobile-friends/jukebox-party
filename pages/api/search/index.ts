import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { tryQueryParam } from '../../../utils/query';

export const baseURL = 'search';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const query = tryQueryParam(req, 'q');
  if (query === null) {
    res.status(400).json({ message: 'Missing q parameter' });
    return;
  }

  const type = tryQueryParam(req, 'type');
  if (type === null) {
    res.status(400).json({ message: 'Missing type parameter' });
    return;
  }

  const spotifyRes = await spotifyClient.get(
    `${baseURL}?q=${query}&type=${type}`,
    {
      headers: {
        Authorization: req?.headers?.authorization,
      },
    }
  );
  res.status(200).json(spotifyRes.data);
}
