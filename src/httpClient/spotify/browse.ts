import { spotifyClient } from '.';
import { Track } from '@common/types/track';
import { parseTrack } from '@common/spotifyParsing';

const recommendations = async (
  tracks: string,
  token: string
): Promise<Track[]> => {
  const res =
    await spotifyClient.get<SpotifyApi.RecommendationsFromSeedsResponse>(
      `/recommendations?limit=1&seed_tracks=${tracks}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  return res.data.tracks.map(parseTrack);
};

export { recommendations };
