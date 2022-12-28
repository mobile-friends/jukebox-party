import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { SkipResult, SkipSuccess } from '@endpoint/skip/dto';
import { Respond } from '@common/infrastructure/respond';
import { tryQueryParam } from '@common/util/query';
import { SkipDirection } from '@common/types/global';
import { SpotifyClient } from '@common/spotifyClient';

function tryParseSkipDirection(s: string): SkipDirection | null {
  const i = parseInt(s);
  return i in SkipDirection ? (i as SkipDirection) : null;
}

export default requestHandler<NoBody, SkipResult>(
  async ({ spotifyToken, query }) => {
    if (spotifyToken === null) {
      return Respond.withNoSpotifyError();
    }

    const directionParam = tryQueryParam(query, 'direction');
    if (directionParam === null) {
      return Respond.withMissingQueryParamError('direction');
    }

    const direction = tryParseSkipDirection(directionParam);
    if (direction === null) {
      return Respond.withInvalidQueryParamError('direction');
    }

    const response =
      direction === SkipDirection.Forward
        ? await SpotifyClient.skipToNextTrack(spotifyToken)
        : await SpotifyClient.backToPreviousTrack(spotifyToken);

    return Respond.withOk<SkipSuccess>({});
  }
);
