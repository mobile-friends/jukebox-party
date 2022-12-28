import { SuccessResult } from '@common/infrastructure/types';
import { DtoError, NoSpotifyError } from '@common/infrastructure/errors';

export interface SkipSuccess extends SuccessResult {}

export type SkipError = NoSpotifyError | DtoError;

export type SkipResult = SkipSuccess | SkipError;
