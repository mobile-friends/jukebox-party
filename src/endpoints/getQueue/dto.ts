import { Track } from '@common/types/track';
import { NoSpotifyError, NotImplementedError } from '@common/types/errors';
import { SuccessResult } from '@common/infrastructure/types';

export interface GetQueueSuccess extends SuccessResult {
  tracks: Track[];
}

export type GetQueueError = NoSpotifyError | NotImplementedError;

export type GetQueueResult = GetQueueSuccess | GetQueueError;
