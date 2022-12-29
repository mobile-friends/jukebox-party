import { Respond } from '@common/infrastructure/respond';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { SpotifyClient } from '@common/spotifyClient';
import { SuccessResult } from '@common/infrastructure/types';
import { PlaybackState } from '@common/types/playbackState';
import {
  NoSpotifyError,
  NotImplementedError,
} from '@common/infrastructure/errors';

export interface GetPlaybackSuccess extends SuccessResult {
  playbackState: PlaybackState;
}

export type GetPlaybackError = NoSpotifyError | NotImplementedError;

export type GetPlaybackResult = GetPlaybackSuccess | GetPlaybackError;

export default requestHandler<NoBody, GetPlaybackResult>(
  async ({ spotifyToken, body }) => {
    if (!spotifyToken) return Respond.withNoSpotifyError();

    const playbackState = await SpotifyClient.getPlaybackState(spotifyToken);
    return Respond.withOk<GetPlaybackSuccess>({
      playbackState,
    });
  }
);
