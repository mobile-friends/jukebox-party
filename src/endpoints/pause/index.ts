import { NextApiRequest, NextApiResponse } from 'next';
import { PauseResponse } from './/dto';
import { noData, sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { spotifyClient } from '@httpClient/spotify';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<PauseResponse>
) {
  await spotifyClient.get(`me/player/pause`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  sendSuccess(res, StatusCodes.OK, noData);
}
