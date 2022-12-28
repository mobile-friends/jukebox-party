import { GetQueueResult, GetQueueSuccess } from '@endpoint/getQueue/dto';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { SpotifyClient } from '@common/spotifyClient';

export default requestHandler<NoBody, GetQueueResult>(
  async ({ spotifyToken }) => {
    if (spotifyToken === null) {
      return Respond.withNoSpotifyError();
    }
    const tracks = await SpotifyClient.getQueue(spotifyToken);
    return Respond.withOk<GetQueueSuccess>({ tracks });
  }
);
