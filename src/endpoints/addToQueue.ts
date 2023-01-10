import { requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { SpotifyClient } from '@common/spotifyClient';
import { NoSpotifyError, Ok } from '@common/infrastructure/types';
import { Track } from '@common/types/track';

export interface AddToQueueBody {
  track: Track;
}

export type AddToQueueResult = Ok<any> | NoSpotifyError;

export default requestHandler<AddToQueueBody, AddToQueueResult>(async (req) => {
  if (req.spotifyToken === null) {
    return Response.noSpotify();
  }
  await SpotifyClient.addToQueue(req.spotifyToken, req.body.track.id);
  return { code: 204, content: '' };
});
