import { ApiResponse } from '@common/apiResponse';

export type GetTracksDto = SpotifyApi.SearchResponse;

export type GetTracksResponse = ApiResponse<GetTracksDto>;
