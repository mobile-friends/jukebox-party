import { SuccessResult } from '@common/infrastructure/types';
import { Track } from '@common/types/track';
import {
  DtoError,
  NoSpotifyError,
  NotImplementedError,
} from '@common/types/errors';

export interface GetPartyTrackSuccess extends SuccessResult {
  track: Track | null;
}

export type GetPartyTrackError =
  | NoSpotifyError
  | DtoError
  | NotImplementedError;

export type GetPartyTrackResult = GetPartyTrackSuccess | GetPartyTrackError;
