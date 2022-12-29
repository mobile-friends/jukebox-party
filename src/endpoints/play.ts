import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { SpotifyClient } from '@common/spotifyClient';
import {
  NoContent,
  NoSpotifyError,
  NotImplementedError,
} from '@common/infrastructure/types';

export type PlayError = NoSpotifyError | NotImplementedError;

export type PlayResult = NoContent | PlayError;

export default requestHandler<NoBody, PlayResult>(async ({ spotifyToken }) => {
  if (spotifyToken === null) {
    return Response.noSpotify();
  }
  await SpotifyClient.setPlayback(spotifyToken, true);
  return Response.noContent();
});
