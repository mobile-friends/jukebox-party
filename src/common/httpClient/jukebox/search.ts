import { jukeboxClient } from './index';
import { Track } from '@common/track';
import { Duration } from '@common/duration';
import { Artist } from '@common/artist';
import { GetTracksResponse } from '@features/searchTracks/dto';

type SearchType = 'track';

const search = async (
  q: string,
  type: SearchType,
  token: string
): Promise<Track[]> => {
  q = encodeURIComponent(q);
  const encodedType = encodeURIComponent(type);
  const url = `$search?q=${q}&type=${encodedType}`;
  const res = await jukeboxClient.get<GetTracksResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  /*
  Currently, if the request returns undefined somewhere, we just use default
  values to compensate, like [] if tracks is undefined.
  TODO: Handle these errors better
   */
  const spotifyTracks = res.data.tracks?.items ?? [];
  return spotifyTracks.map((track) =>
    Track.make(
      track.name,
      Duration.makeFromSeconds(track.duration_ms / 1000),
      track.artists.map((artist) => Artist.make(artist.name)),
      track.album.images[0].url
    )
  );
};

export { search };
