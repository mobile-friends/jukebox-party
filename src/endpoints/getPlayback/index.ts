import { NextApiRequest, NextApiResponse } from 'next';
import { GetPlaybackResponse } from '../getPlayback/dto';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { spotifyClient } from '../../httpClient/spotify';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<GetPlaybackResponse>
) {
  let spotifyRes = await spotifyClient.get<SpotifyApi.CurrentPlaybackResponse>(
    'me/player/',
    {
      headers: {
        Authorization: req.headers.authorization,
      },
    }
  );
  sendSuccess(res, StatusCodes.OK, spotifyRes.data);
}
