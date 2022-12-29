import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { SpotifyClient } from '@common/spotifyClient';
import { SuccessResult } from '@common/infrastructure/types';
import {
  NoSpotifyError,
  NotImplementedError,
} from '@common/infrastructure/errors';

export interface PlaySuccess extends SuccessResult {}

export type PlayError = NoSpotifyError | NotImplementedError;

export type PlayResult = PlaySuccess | PlayError;

export default requestHandler<NoBody, PlayResult>(async ({ spotifyToken }) => {
  if (spotifyToken === null) {
    return Respond.withNoSpotifyError();
  }
  await SpotifyClient.setPlayback(spotifyToken, true);
  return Respond.withOk<PlaySuccess>({});
});
