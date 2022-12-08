import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { tryQueryParam } from '../../../lib/query';
import {
  ApiErrorResponse,
  methodNotAllowed,
  missingParam,
  sendError,
} from '../../../lib/apiError';

export const BaseURL = 'search';

export type GetResponseBody = any | ApiErrorResponse;

export type ResponseBody = GetResponseBody | ApiErrorResponse;

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseBody>
) {
  const query = tryQueryParam(req.query, 'q');
  if (query === null) {
    return sendError(req, res, missingParam('q'));
  }

  const type = tryQueryParam(req.query, 'type');
  if (type === null) {
    return sendError(req, res, missingParam('type'));
  }

  const spotifyRes = await spotifyClient.get(
    `${BaseURL}?q=${query}&type=${type}`,
    {
      headers: {
        Authorization: req?.headers?.authorization,
      },
    }
  );
  res.status(200).json(spotifyRes.data);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (req.method === 'GET') {
    return await handleGet(req, res);
  }
  return sendError(req, res, methodNotAllowed(['GET']));
}
