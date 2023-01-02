import { Response } from '@common/infrastructure/response';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { SpotifyClient } from '@common/spotifyClient';
import { NoSpotifyError, Ok } from '@common/infrastructure/types';
import { PlaybackState } from '@common/types/playbackState';

export type GetPlaybackSuccess =
  | {
      kind: 'NotPlaying';
    }
  | {
      kind: 'Playing';
      playbackState: PlaybackState;
    };

export type GetPlaybackError = NoSpotifyError;

export type GetPlaybackResult = Ok<GetPlaybackSuccess> | GetPlaybackError;

export default requestHandler<NoBody, GetPlaybackResult>(
  async ({ spotifyToken }) => {
    if (!spotifyToken) return Response.noSpotify();

    const playbackState = await SpotifyClient.getPlaybackState(spotifyToken);
    if (playbackState === null)
      return Response.ok<GetPlaybackSuccess>({ kind: 'NotPlaying' });
    return Response.ok<GetPlaybackSuccess>({ kind: 'Playing', playbackState });
  }
);
