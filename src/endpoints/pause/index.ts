import { PauseResult } from './/dto';
import { spotifyClient } from '@httpClient/spotify';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { isSpotifyError } from '@common/util/typeGuards';

export default requestHandler<NoBody, PauseResult>(async (req) => {
  if (req.spotifyToken === null) {
    return Respond.withNoSpotifyError();
  }
  const response = await spotifyClient.put<string>(
    `me/player/pause`,
    req.spotifyToken
  );
  if (!isSpotifyError(response)) return Respond.withOk({});
  else return Respond.withNotImplementedError();
});
