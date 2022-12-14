import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '@common/httpClient/spotify';
import { tryQueryParam } from '@common/query';
import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { ApiResponse, sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { sendMissingQueryParamError } from '@common/errors';

export const BaseURL = 'search';

export type GetTracksDto = SpotifyApi.SearchResponse;

export type GetTracksResponse = ApiResponse<GetTracksDto>;

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<GetTracksResponse>
) {
  const query = tryQueryParam(req.query, 'q');
  if (query === null) {
    return sendMissingQueryParamError(res, 'q');
  }

  const type = tryQueryParam(req.query, 'type');
  if (type === null) {
    return sendMissingQueryParamError(res, 'type');
  }

  const spotifyRes = await spotifyClient.get(
    `${BaseURL}?q=${query}&type=${type}`,
    {
      headers: {
        Authorization: req?.headers?.authorization,
      },
    }
  );
  sendSuccess(res, StatusCodes.OK, spotifyRes.data);
}

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGet,
});