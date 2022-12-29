import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { SpotifyClient } from '@common/spotifyClient';
import { SuccessResult } from '@common/infrastructure/types';
import {
  NoSpotifyError,
  NotImplementedError,
} from '@common/infrastructure/errors';

export interface PauseSuccess extends SuccessResult {}

export type PauseError = NoSpotifyError | NotImplementedError;

export type PauseResult = PauseSuccess | PauseError;

export default requestHandler<NoBody, PauseResult>(async ({ spotifyToken }) => {
  if (spotifyToken === null) {
    return Respond.withNoSpotifyError();
  }
  await SpotifyClient.setPlayback(spotifyToken, false);
  return Respond.withOk<PauseSuccess>({});
});
