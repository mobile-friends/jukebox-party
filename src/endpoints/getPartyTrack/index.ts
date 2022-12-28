import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import {
  GetPartyTrackResult,
  GetPartyTrackSuccess,
} from '@endpoint/getPartyTrack/dto';
import { Respond } from '@common/infrastructure/respond';
import { SpotifyClient } from '@common/spotifyClient';

export default requestHandler<NoBody, GetPartyTrackResult>(
  async ({ spotifyToken, query }) => {
    if (!spotifyToken) return Respond.withNoSpotifyError();
    const track = await SpotifyClient.getCurrentTrack(spotifyToken);
    return Respond.withOk<GetPartyTrackSuccess>({ track });
  }
);
