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
  return res.data.tracks;
};

export { search };
