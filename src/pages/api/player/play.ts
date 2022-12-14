import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '@common/httpClient/spotify';
import { BaseURL } from './index';
import { ApiResponse, noData, NoData, sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';

export type SetPlaybackDto = NoData;

export type SetPlaybackResponse = ApiResponse<SetPlaybackDto>;

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<SetPlaybackResponse>
) {
  await spotifyClient.get(`${BaseURL}/play`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  sendSuccess(res, StatusCodes.OK, noData);
}

export default multiMethodHandler({
  [HTTPMethod.PUT]: handlePut,
});
