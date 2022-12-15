import { ApiResponse } from '@common/apiResponse';
import { Track } from '@common/types/track';

export type GetQueueDto = Track[];

export type GetQueueResponse = ApiResponse<GetQueueDto>;
