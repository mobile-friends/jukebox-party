import { jukeboxClient } from './index';
import { Track } from '../../lib/track';
import { Duration } from '../../lib/duration';
import { Artist } from '../../lib/artist';

const baseURL = 'search';

type SearchType = 'track';

const search = async (
  q: string,
  type: SearchType,
  token: string
): Promise<Track[]> => {
  q = encodeURIComponent(q);
  const encodedType = encodeURIComponent(type);
  const url = `${baseURL}?q=${q}&type=${encodedType}`;
  const res = await jukeboxClient.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const trackData: any[] = res.data.tracks.items;
  return trackData.map((data) =>
    Track.make(
      data.name,
      Duration.make(0, data.duration_ms / 1000),
      [data.artists.map((artist: any) => Artist.make(artist.name))],
      data.album.images[0].url
    )
  );
};

export { search };
