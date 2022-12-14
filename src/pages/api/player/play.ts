import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '@common/httpClient/spotify';
import { BaseURL } from './index';
import { ApiResponse, sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';

type PutSpotifyPlayerResponse = ApiResponse<
  | any // TODO: This needs typing
  | never // TODO: This needs typing
>;

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<PutSpotifyPlayerResponse>
) {
  let spotifyRes = await spotifyClient.get(`${BaseURL}/play`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  sendSuccess(res, StatusCodes.OK, spotifyRes.data);
}

export default multiMethodHandler({
  [HTTPMethod.PUT]: handlePut,
});
