import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '@common/httpClient/spotify';
import { ApiResponse, sendSuccess } from '@common/apiResponse';
import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { StatusCodes } from 'http-status-codes';

export const BaseURL = 'me/player/';

export type GetPlaybackDto = SpotifyApi.CurrentPlaybackResponse;

export type GetPlaybackResponse = ApiResponse<GetPlaybackDto>;

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<GetPlaybackResponse>
) {
  let spotifyRes = await spotifyClient.get<SpotifyApi.CurrentPlaybackResponse>(
    BaseURL,
    {
      headers: {
        Authorization: req.headers.authorization,
      },
    }
  );
  sendSuccess(res, StatusCodes.OK, spotifyRes.data);
}

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGet,
});
