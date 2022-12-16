import { jukeboxClient } from './index';
import { Track } from '@common/types/track';
import { GetTracksResponse } from '@endpoint/searchTracks/dto';

type SearchType = 'track';

const search = async (
  q: string,
  type: SearchType,
  token: string
): Promise<Track[]> => {
  q = encodeURIComponent(q);
  const encodedType = encodeURIComponent(type);
  const url = `$search?q=${q}&type=${encodedType}`;
  const response = await jukeboxClient.get<GetTracksResponse>(url, token);
  return response.tracks;
};

export { search };
