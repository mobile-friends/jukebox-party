import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { SpotifyClient } from '@common/spotifyClient';
import {
  NoContent,
  NoSpotifyError,
  NotImplementedError,
} from '@common/infrastructure/types';

export type PauseError = NoSpotifyError | NotImplementedError;

export type PauseResult = NoContent | PauseError;

export default requestHandler<NoBody, PauseResult>(async ({ spotifyToken }) => {
  if (spotifyToken === null) {
    return Response.noSpotify();
  }
  await SpotifyClient.setPlayback(spotifyToken, false);
  return Response.noContent();
});
