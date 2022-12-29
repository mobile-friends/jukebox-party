import { tryQueryParam } from '@common/util/query';
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

export interface SearchTracksSuccess extends SuccessResult {
  tracks: Track[];
}

export type SearchTracksError = DtoError | NoSpotifyError | NotImplementedError;

export type SearchTracksResult = SearchTracksSuccess | SearchTracksError;

export default requestHandler<NoBody, SearchTracksResult>(
  async ({ spotifyToken, query }) => {
    if (spotifyToken === null) {
      return Respond.withNoSpotifyError();
    }

    const searchQuery = tryQueryParam(query, 'q');
    if (searchQuery === null) {
      return Respond.withMissingQueryParamError('q');
    }

    const tracks = await SpotifyClient.searchTracks(spotifyToken, searchQuery);
    return Respond.withOk<SearchTracksSuccess>({ tracks });
  }
);
