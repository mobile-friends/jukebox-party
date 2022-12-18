import { spotifyClient } from '@httpClient/spotify';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { isSpotifyError } from '@common/util/typeGuards';
import { PlayResult } from '@endpoint/play/dto';

export default requestHandler<NoBody, PlayResult>(async (req) => {
  if (req.spotifyToken === null) {
    return Respond.withNoSpotifyError();
  }
  const response = await spotifyClient.get<string>(
    `me/player/play`,
    req.spotifyToken
  );
  if (!isSpotifyError(response)) return Respond.withOk({});
  else return Respond.withNotImplementedError();
});
