import { PauseResult, PauseSuccess } from './/dto';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { SpotifyClient } from '@common/spotifyClient';

export default requestHandler<NoBody, PauseResult>(async ({ spotifyToken }) => {
  if (spotifyToken === null) {
    return Respond.withNoSpotifyError();
  }
  await SpotifyClient.setPlayback(spotifyToken, false);
  return Respond.withOk<PauseSuccess>({});
});
