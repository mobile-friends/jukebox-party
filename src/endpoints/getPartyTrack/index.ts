import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import {
  GetPartyTrackResult,
  GetPartyTrackSuccess,
} from '@endpoint/getPartyTrack/dto';
import { Respond } from '@common/infrastructure/respond';
import { currentlyPlaying } from '@httpClient/spotify/player';

export default requestHandler<NoBody, GetPartyTrackResult>(
  async ({ spotifyToken, query }) => {
    if (!spotifyToken) return Respond.withNoSpotifyError();
    const track = await currentlyPlaying(spotifyToken);
    return Respond.withOk<GetPartyTrackSuccess>({ track });
  }
);
