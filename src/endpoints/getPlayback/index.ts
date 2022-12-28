import { GetPlaybackResult, GetPlaybackSuccess } from '../getPlayback/dto';
import { spotifyClient, SpotifyResponse } from '@httpClient/spotify';
import { isSpotifyError } from '@common/util/typeGuards';
import { Respond } from '@common/infrastructure/respond';
import { PlaybackState } from '@common/types/playbackState';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Duration } from '@common/types/duration';

function requestPlaybackState(
  spotifyToken: string
): Promise<SpotifyResponse<SpotifyApi.CurrentPlaybackResponse>> {
  return spotifyClient.get<SpotifyApi.CurrentPlaybackResponse>(
    'me/player/',
    spotifyToken
  );
}

function parsePlaybackState(
  response: SpotifyApi.CurrentPlaybackResponse
): PlaybackState {
  return PlaybackState.make(
    Duration.makeFromMillis(response.progress_ms ?? 0),
    response.is_playing
  );
}

export default requestHandler<NoBody, GetPlaybackResult>(
  async ({ spotifyToken, body }) => {
    if (!spotifyToken) return Respond.withNoSpotifyError();
    let response = await requestPlaybackState(spotifyToken);

    // TODO: Handle errors
    if (isSpotifyError(response)) return Respond.withNotImplementedError();

    const playbackState = parsePlaybackState(response);
    return Respond.withOk<GetPlaybackSuccess>({
      playbackState,
    });
  }
);
