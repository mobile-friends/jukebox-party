import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { SpotifyClient } from '@common/spotifyClient';
import {
  DtoError,
  NoSpotifyError,
  NotImplementedError,
  Ok,
} from '@common/infrastructure/types';
import { Track } from '@common/types/track';

export interface GetPartyTrackSuccess {
  track: Track | null;
}

export type GetPartyTrackError =
  | NoSpotifyError
  | DtoError
  | NotImplementedError;

export type GetPartyTrackResult = Ok<GetPartyTrackSuccess> | GetPartyTrackError;

export default requestHandler<NoBody, GetPartyTrackResult>(
  async ({ spotifyToken, query }) => {
    if (!spotifyToken) return Response.noSpotify();
    const track = await SpotifyClient.getCurrentTrack(spotifyToken);
    return Response.ok<GetPartyTrackSuccess>({ track });
  }
);
