import { ApiResponse } from '@common/apiResponse';
import { Track } from '@common/types/track';
import { DtoError } from '@common/errors';

export interface GetTracksDto {
  tracks: Track[];
}

export type GetTracksError = DtoError;

export type GetTracksResponse = ApiResponse<GetTracksDto | GetTracksError>;
