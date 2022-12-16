import { NextApiRequest, NextApiResponse } from 'next';
import { PlayResponse } from './/dto';
import { noData, sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { spotifyClient } from '@httpClient/spotify';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<PlayResponse>
) {
  const token = req?.headers?.authorization;
  if (token === undefined) {
    // TODO: Handle not authorized
    return;
  }
  await spotifyClient.get<string>(`me/player/play`, token);
  // TODO: Handle errors
  sendSuccess(res, StatusCodes.OK, noData);
}
