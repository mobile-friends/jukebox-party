import { Track } from '@common/types/track';
import {
  DtoError,
  NoSpotifyError,
  NotImplementedError,
} from '@common/infrastructure/errors';
import { SuccessResult } from '@common/infrastructure/types';

export interface SearchTracksSuccess extends SuccessResult {
  tracks: Track[];
}

export type SearchTracksError = DtoError | NoSpotifyError | NotImplementedError;

export type SearchTracksResult = SearchTracksSuccess | SearchTracksError;
