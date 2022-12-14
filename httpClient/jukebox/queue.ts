import { jukeboxClient } from '.';
import { Track } from '../../lib/track';
import { Duration } from '../../lib/duration';
import { Artist } from '../../lib/artist';

const baseURL = 'queue';


const queue = async (
  token: string
): Promise<Track[]> => {
  const res = await jukeboxClient.get(baseURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const trackData: any[] = res.data;
  return trackData.map((data) =>
    Track.make(
      data.name,
      Duration.make(0, data.duration_ms / 1000),
      [data.artists.map((artist: any) => Artist.make(artist.name))],
      data.album.images[2].url
    )
  );
};

export { queue };
