import { SearchTracksResult } from '../searchTracks/dto';
import { tryQueryParam } from '@common/util/query';
import { spotifyClient } from '@httpClient/spotify';
import { Track } from '@common/types/track';
import { parseTrack } from '@common/spotifyParsing';
import { isSpotifyError } from '@common/util/typeGuards';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';

/**
 * Parses the tracks from a Spotify search-response object
 * @param response The response
 */
function parseTracksIn(response: SpotifyApi.SearchResponse): Track[] {
  /*
Currently, if the request returns undefined somewhere, we just use default
values to compensate, like [] if tracks is undefined.
TODO: Handle these errors better
*/
  const unparsedTracks = response.tracks?.items ?? [];
  return unparsedTracks.map(parseTrack);
}

export default requestHandler<NoBody, SearchTracksResult>(async (req) => {
  if (req.spotifyToken === null) {
    return Respond.withNoSpotifyError();
  }

  const query = tryQueryParam(req.query, 'q');
  if (query === null) {
    return Respond.withMissingQueryParamError('q');
  }

  const type = tryQueryParam(req.query, 'type');
  if (type === null) {
    return Respond.withMissingQueryParamError('type');
  }

  const response = await spotifyClient.get<SpotifyApi.SearchResponse>(
    `/search?q=${query}&type=${type}`,
    req.spotifyToken
  );

  if (!isSpotifyError(response)) {
    const tracks = parseTracksIn(response);
    return Respond.withOk({ tracks });
  } else {
    return Respond.withNotImplementedError();
  }
});
