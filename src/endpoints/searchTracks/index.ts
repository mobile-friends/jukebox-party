import { NextApiRequest, NextApiResponse } from 'next';
import { GetTracksResponse } from '../searchTracks/dto';
import { tryQueryParam } from '@common/util/query';
import { sendMissingQueryParamError } from '@common/errors';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { spotifyClient } from '@httpClient/spotify';
import { Track } from '@common/types/track';
import { parseTrack } from '@common/spotifyParsing';
import { isSpotifyError } from '@common/util/typeGuards';

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

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<GetTracksResponse>
) {
  const query = tryQueryParam(req.query, 'q');
  if (query === null) {
    return sendMissingQueryParamError(res, 'q');
  }

  const type = tryQueryParam(req.query, 'type');
  if (type === null) {
    return sendMissingQueryParamError(res, 'type');
  }

  const token = req?.headers?.authorization;
  if (token === undefined) {
    // TODO: Handle not authorized
    return;
  }
  const response = await spotifyClient.get<SpotifyApi.SearchResponse>(
    `$search?q=${query}&type=${type}`,
    token
  );

  if (!isSpotifyError(response)) {
    const tracks = parseTracksIn(response);
    sendSuccess(res, StatusCodes.OK, { tracks });
  } else {
    // TODO: Handle errors
  }
}
