import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { SpotifyClient } from '@common/spotifyClient';
import {
  NoSpotifyError,
  NotImplementedError,
  Ok,
} from '@common/infrastructure/types';
import { Track } from '@common/types/track';

export interface GetQueueSuccess {
  tracks: Track[];
}

export type GetQueueError = NoSpotifyError | NotImplementedError;

export type GetQueueResult = Ok<GetQueueSuccess> | GetQueueError;

export default requestHandler<NoBody, GetQueueResult>(
  async ({ spotifyToken }) => {
    if (spotifyToken === null) {
      return Response.noSpotify();
    }
    const tracks = await SpotifyClient.getQueue(spotifyToken);
    return Response.ok<GetQueueSuccess>({ tracks });
  }
);
