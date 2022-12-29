import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { SpotifyClient } from '@common/spotifyClient';
import { SuccessResult } from '@common/infrastructure/types';
import { Track } from '@common/types/track';
import {
  DtoError,
  NoSpotifyError,
  NotImplementedError,
} from '@common/infrastructure/errors';

export interface GetPartyTrackSuccess extends SuccessResult {
  track: Track | null;
}

export type GetPartyTrackError =
  | NoSpotifyError
  | DtoError
  | NotImplementedError;

export type GetPartyTrackResult = GetPartyTrackSuccess | GetPartyTrackError;

export default requestHandler<NoBody, GetPartyTrackResult>(
  async ({ spotifyToken, query }) => {
    if (!spotifyToken) return Respond.withNoSpotifyError();
    const track = await SpotifyClient.getCurrentTrack(spotifyToken);
    return Respond.withOk<GetPartyTrackSuccess>({ track });
  }
);
