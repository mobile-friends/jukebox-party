import { NextApiRequest, NextApiResponse } from 'next';
import { GetTracksResponse } from '@features/searchTracks/dto';
import { tryQueryParam } from '@common/query';
import { sendMissingQueryParamError } from '@common/errors';
import { spotifyClient } from '@common/httpClient/spotify';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';

export async function handleGetTracksRequest(
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
    `$search?q=${query}&type=${type}`,
    {
      headers: {
        Authorization: req?.headers?.authorization,
      },
    }
  );
  sendSuccess(res, StatusCodes.OK, spotifyRes.data);
}
