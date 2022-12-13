import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '@src/httpClient/spotify';
import { ApiResponse, sendSuccess } from '@src/common/apiResponse';
import { multiMethodHandler } from '@src/common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { StatusCodes } from 'http-status-codes';

export const BaseURL = 'me/player/';

export type GetSpotifyPlayerResponse = ApiResponse<
  any, // TODO: This needs typing
  never // TODO: This needs typing
>;

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<GetSpotifyPlayerResponse>
) {
  let spotifyRes = await spotifyClient.get(BaseURL, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  sendSuccess(res, StatusCodes.OK, spotifyRes.data);
}

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGet,
});
