import { NoSpotifyError, NotImplementedError } from '@common/types/errors';
import { SuccessResult } from '@common/infrastructure/types';

export interface PlaySuccess extends SuccessResult {}

export type PlayError = NoSpotifyError | NotImplementedError;

export type PlayResult = PlaySuccess | PlayError;
