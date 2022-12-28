import { NoSpotifyError, NotImplementedError } from '@common/infrastructure/errors';
import { SuccessResult } from '@common/infrastructure/types';

export interface PlaySuccess extends SuccessResult {}

export type PlayError = NoSpotifyError | NotImplementedError;

export type PlayResult = PlaySuccess | PlayError;
