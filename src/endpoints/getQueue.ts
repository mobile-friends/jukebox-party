import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { SpotifyClient } from '@common/spotifyClient';
import { SuccessResult } from '@common/infrastructure/types';
import { Track } from '@common/types/track';
import {
  NoSpotifyError,
  NotImplementedError,
} from '@common/infrastructure/errors';

export interface GetQueueSuccess extends SuccessResult {
  tracks: Track[];
}

export type GetQueueError = NoSpotifyError | NotImplementedError;

export type GetQueueResult = GetQueueSuccess | GetQueueError;

export default requestHandler<NoBody, GetQueueResult>(
  async ({ spotifyToken }) => {
    if (spotifyToken === null) {
      return Respond.withNoSpotifyError();
    }
    const tracks = await SpotifyClient.getQueue(spotifyToken);
    return Respond.withOk<GetQueueSuccess>({ tracks });
  }
);
