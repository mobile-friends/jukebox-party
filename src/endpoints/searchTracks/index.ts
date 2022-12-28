import { SearchTracksResult, SearchTracksSuccess } from '../searchTracks/dto';
import { tryQueryParam } from '@common/util/query';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { SpotifyClient } from '@common/spotifyClient';

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
