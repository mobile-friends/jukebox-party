import { GetPlaybackResult } from '../getPlayback/dto';
import { spotifyClient } from '@httpClient/spotify';
import { isSpotifyError } from '@common/util/typeGuards';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { PlaybackState } from '@common/types/playbackState';
import { Duration } from '@common/types/duration';

export default requestHandler<NoBody, GetPlaybackResult>(async (req) => {
  if (req.spotifyToken === null) {
    return Respond.withNoSpotifyError();
  }
  let response = await spotifyClient.get<SpotifyApi.CurrentPlaybackResponse>(
    'me/player/',
    req.spotifyToken
  );
  if (!isSpotifyError(response)) {
    return Respond.withOk({
      playbackState: PlaybackState.make(
        Duration.makeFromMillis(response.timestamp),
        response.is_playing
      ),
    });
  } else {
    return Respond.withNotImplementedError();
  }
});
