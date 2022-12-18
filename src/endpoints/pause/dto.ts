import { NoSpotifyError, NotImplementedError } from '@common/types/errors';
import { SuccessResult } from '@common/infrastructure/types';

export interface PauseSuccess extends SuccessResult {}

export type PauseError = NoSpotifyError | NotImplementedError;

export type PauseResult = PauseSuccess | PauseError;
