import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { tryQueryParam } from '@common/util/query';
import { SpotifyClient } from '@common/spotifyClient';
import {
  DtoError,
  NoContent,
  NoSpotifyError,
} from '@common/infrastructure/types';

export type SkipError = NoSpotifyError | DtoError;

export type SkipResult = NoContent | SkipError;

function tryParseSkipDirection(s: string): SkipDirection | null {
  const i = parseInt(s);
  return i in SkipDirection ? (i as SkipDirection) : null;
}

export default requestHandler<NoBody, SkipResult>(
  async ({ spotifyToken, query }) => {
    if (spotifyToken === null) {
      return Response.noSpotify();
    }

    const directionParam = tryQueryParam(query, 'direction');
    if (directionParam === null) {
      return Response.missingQueryParam('direction');
    }

    const direction = tryParseSkipDirection(directionParam);
    if (direction === null) {
      return Response.invalidQueryParam('direction');
    }

    const response =
      direction === SkipDirection.Forward
        ? await SpotifyClient.skipToNextTrack(spotifyToken)
        : await SpotifyClient.backToPreviousTrack(spotifyToken);

    return Response.noContent();
  }
);
