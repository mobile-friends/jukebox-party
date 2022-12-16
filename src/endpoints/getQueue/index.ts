import { NextApiRequest, NextApiResponse } from 'next';
import { GetQueueResponse } from '@endpoint/getQueue/dto';
import { spotifyClient } from '@httpClient/spotify';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { parseTrack } from '@common/spotifyParsing';
import { Track } from '@common/types/track';
import { isSpotifyError } from '@common/util/typeGuards';
import { sendGenericServerError } from '@common/errors';

function isTrackItem(
  item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull
): item is SpotifyApi.TrackObjectFull {
  return item.type === 'track';
}

function parseTracksIn(response: SpotifyApi.UsersQueueResponse): Track[] {
  const items = response.queue;
  // Currently we can only handle tracks here
  // A Spotify queue may also contain episodes however
  // For now we just filter those out
  return items.filter(isTrackItem).map(parseTrack);
}

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<GetQueueResponse>
) {
  const spotifyRes = await spotifyClient.get<
    SpotifyApi.UsersQueueResponse | SpotifyApi.ErrorObject
  >('me/player/queue', {
    headers: {
      Authorization: req?.headers?.authorization,
    },
  });

  const response = spotifyRes.data;
  // TODO: Handle errors better
  if (!isSpotifyError(response)) {
    const tracks = parseTracksIn(response);
    return sendSuccess(res, StatusCodes.OK, tracks);
  } else return sendGenericServerError(res, 'A spotify request error occurred');
}
