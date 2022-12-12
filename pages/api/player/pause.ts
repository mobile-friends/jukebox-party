import { NextApiRequest, NextApiResponse } from 'next';
import { spotifyClient } from '../../../httpClient/spotify';
import { BaseURL } from './index';
import {
  ApiErrorResponse,
  methodNotAllowed,
  sendError,
} from '../../../lib/apiError';

export type PutResponseBody = any;

export type ResponseBody = PutResponseBody | ApiErrorResponse;

export default async function pauseTrack(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    await spotifyClient.put(
      `${BaseURL}/pause`,
      {},
      {
        headers: {
          Authorization: req?.headers?.authorization,
        },
      }
    );
    res.status(204).end();
  }
}
