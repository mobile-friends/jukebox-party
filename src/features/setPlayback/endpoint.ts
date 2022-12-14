import { NextApiRequest, NextApiResponse } from 'next';
import { SetPlaybackResponse } from '@features/setPlayback/dto';
import { spotifyClient } from '@common/httpClient/spotify';
import { noData, sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';

export async function handleSetPlaybackRequest(
  req: NextApiRequest,
  res: NextApiResponse<SetPlaybackResponse>
) {
  await spotifyClient.get(`me/player/play`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  sendSuccess(res, StatusCodes.OK, noData);
}
