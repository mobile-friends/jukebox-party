import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { PlayResult, PlaySuccess } from '@endpoint/play/dto';
import { SpotifyClient } from '@common/spotifyClient';

export default requestHandler<NoBody, PlayResult>(async ({ spotifyToken }) => {
  if (spotifyToken === null) {
    return Respond.withNoSpotifyError();
  }
  await SpotifyClient.setPlayback(spotifyToken, true);
  return Respond.withOk<PlaySuccess>({});
});
