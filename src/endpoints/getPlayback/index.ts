import { GetPlaybackResult, GetPlaybackSuccess } from '../getPlayback/dto';
import { Respond } from '@common/infrastructure/respond';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { SpotifyClient } from '@common/spotifyClient';

export default requestHandler<NoBody, GetPlaybackResult>(
  async ({ spotifyToken, body }) => {
    if (!spotifyToken) return Respond.withNoSpotifyError();

    const playbackState = await SpotifyClient.getPlaybackState(spotifyToken);
    return Respond.withOk<GetPlaybackSuccess>({
      playbackState,
    });
  }
);
