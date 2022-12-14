import { NextApiRequest, NextApiResponse } from 'next';
import { GetPlaybackResponse } from '@features/getPlayback/dto';
import { spotifyClient } from '@common/../../httpClient/spotify';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';

export async function handleGetPlaybackRequest(
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
