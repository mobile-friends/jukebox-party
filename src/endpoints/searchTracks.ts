import { tryQueryParam } from '@common/util/query';
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

export interface SearchTracksSuccess {
  tracks: Track[];
}

export type SearchTracksError = DtoError | NoSpotifyError | NotImplementedError;

export type SearchTracksResult = Ok<SearchTracksSuccess> | SearchTracksError;

export default requestHandler<NoBody, SearchTracksResult>(
  async ({ spotifyToken, query }) => {
    if (spotifyToken === null) {
      return Response.noSpotify();
    }

    const searchQuery = tryQueryParam(query, 'q');
    if (searchQuery === null) {
      return Response.missingQueryParam('q');
    }

    const tracks = await SpotifyClient.searchTracks(spotifyToken, searchQuery);
    return Response.ok<SearchTracksSuccess>({ tracks });
  }
);
