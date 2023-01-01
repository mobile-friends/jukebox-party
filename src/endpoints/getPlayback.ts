import { Response } from '@common/infrastructure/response';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { SpotifyClient } from '@common/spotifyClient';
import {
  NoSpotifyError,
  NotImplementedError,
  Ok,
} from '@common/infrastructure/types';
import { PlaybackState } from '@common/types/playbackState';

export interface GetPlaybackSuccess {
  playbackState: PlaybackState;
}

export type GetPlaybackError = NoSpotifyError | NotImplementedError;

export type GetPlaybackResult = Ok<GetPlaybackSuccess> | GetPlaybackError;

export default requestHandler<NoBody, GetPlaybackResult>(
  async ({ spotifyToken }) => {
    if (!spotifyToken) return Response.noSpotify();

    const playbackState = await SpotifyClient.getPlaybackState(spotifyToken);
    return Response.ok<GetPlaybackSuccess>({
      playbackState,
    });
  }
);
