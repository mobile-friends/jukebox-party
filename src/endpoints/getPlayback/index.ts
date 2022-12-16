import { NextApiRequest, NextApiResponse } from 'next';
import { GetPlaybackResponse } from '../getPlayback/dto';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { spotifyClient } from '@httpClient/spotify';
import { isSpotifyError } from '@common/util/typeGuards';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<GetPlaybackResponse>
) {
  const token = req?.headers?.authorization;
  if (token === undefined) {
    // TODO: Handle not authorized
    return;
  }
  let response = await spotifyClient.get<SpotifyApi.CurrentPlaybackResponse>(
    'me/player/',
    token
  );
  if (!isSpotifyError(response)) sendSuccess(res, StatusCodes.OK, response);
  else {
    // TODO: Handle errors
  }
}
