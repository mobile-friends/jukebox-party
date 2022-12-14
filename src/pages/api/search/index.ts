import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '@src/httpClient/spotify';
import { tryQueryParam } from '@src/lib/query';
import { multiMethodHandler } from '@src/common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { ApiResponse, sendSuccess } from '@src/common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { sendMissingQueryParamError } from '@src/common/errors';

export const BaseURL = 'search';

export type GetTracksDto = any; // TODO: This needs typing

export type GetTracksError = never; // TODO: This needs typing

export type GetTracksResponse = ApiResponse<GetTracksDto | GetTracksError>;

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
