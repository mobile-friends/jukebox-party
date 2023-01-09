import { requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { SpotifyClient } from '@common/spotifyClient';
import {
  NoContent,
  NoSpotifyError,
  NotImplementedError,
} from '@common/infrastructure/types';

export interface SetPlaybackBody {
  isPlaying: boolean;
}

export type SetPlaybackError = NoSpotifyError | NotImplementedError;

export type SetPlaybackResult = NoContent | SetPlaybackError;

export default requestHandler<SetPlaybackBody, SetPlaybackResult>(
  async ({ body, spotifyToken }) => {
    if (spotifyToken === null) {
      return Response.noSpotify();
    }
    await SpotifyClient.setPlayback(spotifyToken, body.isPlaying);
    return Response.noContent();
  }
);
