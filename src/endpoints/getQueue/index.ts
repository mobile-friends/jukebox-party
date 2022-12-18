import { GetQueueResult } from '@endpoint/getQueue/dto';
import { spotifyClient } from '@httpClient/spotify';
import { parseTrack } from '@common/spotifyParsing';
import { Track } from '@common/types/track';
import { isSpotifyError } from '@common/util/typeGuards';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';

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

export default requestHandler<NoBody, GetQueueResult>(async (req) => {
  if (req.spotifyToken === null) {
    return Respond.withNoSpotifyError();
  }

  const response = await spotifyClient.get<SpotifyApi.UsersQueueResponse>(
    '/me/player/queue',
    req.spotifyToken
  );

  if (!isSpotifyError(response)) {
    const tracks = parseTracksIn(response);
    return Respond.withOk({ tracks });
  } else {
    // TODO: We get a 403 from spotify here. Idk why
    console.error(response);
    return Respond.withNotImplementedError();
  }
});
