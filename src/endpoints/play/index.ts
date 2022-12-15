import { NextApiRequest, NextApiResponse } from 'next';
import { PlayResponse } from './/dto';
import { noData, sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { spotifyClient } from '../../httpClient/spotify';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<PlayResponse>
) {
  await spotifyClient.get(`me/player/play`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  sendSuccess(res, StatusCodes.OK, noData);
}
