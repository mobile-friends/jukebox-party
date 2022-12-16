import { spotifyClient } from '.';
import { Track } from '@common/types/track';
import { parseTrack } from '@common/spotifyParsing';
import { AxiosError } from 'axios';
import { isSpotifyError } from '@common/util/typeGuards';

const recommendations = async (
  seedTrackIds: string[],
  token: string
): Promise<Track[]> => {
  const seedTracks =
    seedTrackIds.length > 0 ? `&seed_tracks=${seedTrackIds.join(',')}` : '';
  // TODO: Seed tracks, seed artists and seed genres are required
  const res = await spotifyClient.get<
    SpotifyApi.RecommendationsFromSeedsResponse | SpotifyApi.ErrorObject
  >(`/recommendations?limit=1${seedTracks}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const response = res.data;
  if (!isSpotifyError(response)) return response.tracks.map(parseTrack);
  // If anything went wrong we just return no recommendations
  // TODO: Handle errors
  else return [];
};

export { recommendations };
