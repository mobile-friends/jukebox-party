import { jukeboxClient } from './index';
import { Track } from '@common/types/track';
import { SearchTracksResult } from '@endpoint/searchTracks/dto';
import { isSuccess } from '@common/infrastructure/response';

type SearchType = 'track';

const search = async (q: string, type: SearchType): Promise<Track[]> => {
  q = encodeURIComponent(q);
  const encodedType = encodeURIComponent(type);
  const url = `/search?q=${q}&type=${encodedType}`;
  const response = await jukeboxClient.get<SearchTracksResult>(url);
  if (isSuccess(response)) return response.data.tracks;
  else {
    console.error(response); // TODO: Handle errors
    throw new Error('Error not handled');
  }
};

export { search };
