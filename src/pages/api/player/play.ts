import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '@src/httpClient/spotify';
import { BaseURL } from './index';
import {
  ApiErrorResponse,
  methodNotAllowed,
  sendError,
} from '@src/lib/apiError';

export type PutResponseBody = any;

export type ResponseBody = PutResponseBody | ApiErrorResponse;

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<PutResponseBody>
) {
  let spotifyRes = await spotifyClient.get(`${BaseURL}/play`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  res.status(200).json(spotifyRes.data);
}

export default async function playTrack(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (req.method === 'PUT') {
    return await handlePut(req, res);
  }

  return sendError(req, res, methodNotAllowed(['PUT']));
}
