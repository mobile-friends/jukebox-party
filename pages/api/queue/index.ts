import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import {
  ApiErrorResponse,
  methodNotAllowed,
  sendError,
} from '../../../lib/apiError';

export const BaseURL = 'me/player/queue';

export type GetResponseBody = any | ApiErrorResponse;

export type ResponseBody = GetResponseBody | ApiErrorResponse;

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseBody>
) {

  const spotifyRes = await spotifyClient.get(`${BaseURL}`, {
    headers: {
      Authorization: req?.headers?.authorization,
    },
  });
  res.status(200).json(spotifyRes.data.queue);

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
