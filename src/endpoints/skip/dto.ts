import { SuccessResult } from '@common/infrastructure/types';
import { DtoError, NoSpotifyError } from '@common/types/errors';

export interface SkipSuccess extends SuccessResult {}

export type SkipError = NoSpotifyError | DtoError;

export type SkipResult = SkipSuccess | SkipError;
