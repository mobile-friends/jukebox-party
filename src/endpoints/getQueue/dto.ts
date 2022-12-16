import { ApiResponse } from '@common/apiResponse';
import { Track } from '@common/types/track';
import { GenericServerError } from '@common/errors';

export type GetQueueDto = Track[];

export type GetQueueError = GenericServerError;

export type GetQueueResponse = ApiResponse<GetQueueDto | GetQueueError>;
