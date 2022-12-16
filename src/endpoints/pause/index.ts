import { NextApiRequest, NextApiResponse } from 'next';
import { PauseResponse } from './/dto';
import { noData, sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { spotifyClient } from '@httpClient/spotify';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<PauseResponse>
) {
  const token = req?.headers?.authorization;
  if (token === undefined) {
    // TODO: Handle not authorized
    return;
  }
  await spotifyClient.get(`me/player/pause`, token);
  // TODO: Handle error
  sendSuccess(res, StatusCodes.OK, noData);
}
