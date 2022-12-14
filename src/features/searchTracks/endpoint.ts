import { NextApiRequest, NextApiResponse } from 'next';
import { GetTracksResponse } from '@features/searchTracks/dto';
import { tryQueryParam } from '@common/query';
import { sendMissingQueryParamError } from '@common/errors';
import { spotifyClient } from '@common/httpClient/spotify';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { Track } from '@common/track';
import { Duration } from '@common/duration';
import { Artist } from '@common/artist';

export async function handleGetTracksRequest(
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

  const spotifyRes = await spotifyClient.get<SpotifyApi.SearchResponse>(
    `$search?q=${query}&type=${type}`,
    {
      headers: {
        Authorization: req?.headers?.authorization,
      },
    }
  );
  /*
 Currently, if the request returns undefined somewhere, we just use default
 values to compensate, like [] if tracks is undefined.
 TODO: Handle these errors better
  */
  const spotifyTracks = spotifyRes.data.tracks?.items ?? [];
  const tracks = spotifyTracks.map((track) =>
    Track.make(
      track.name,
      Duration.makeFromSeconds(track.duration_ms / 1000),
      track.artists.map((artist) => Artist.make(artist.name)),
      track.album.images[0].url
    )
  );

  sendSuccess(res, StatusCodes.OK, { tracks });
}
