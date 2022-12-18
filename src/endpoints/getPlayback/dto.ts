import { NoSpotifyError, NotImplementedError } from '@common/types/errors';
import { SuccessResult } from '@common/infrastructure/types';
import { PlaybackState } from '@common/types/playbackState';

export interface GetPlaybackSuccess extends SuccessResult {
  playbackState: PlaybackState;
}

export type GetPlaybackError = NoSpotifyError | NotImplementedError;

export type GetPlaybackResult = GetPlaybackSuccess | GetPlaybackError;
