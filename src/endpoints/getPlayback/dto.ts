import { ApiResponse } from '@common/apiResponse';

export type GetPlaybackDto = SpotifyApi.CurrentPlaybackResponse;

export type GetPlaybackResponse = ApiResponse<GetPlaybackDto>;
