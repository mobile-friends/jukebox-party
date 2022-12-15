import { jukeboxClient } from '.';
import { Track } from '@common/types/track';
import { GetQueueResponse } from '@endpoint/getQueue/dto';

const baseURL = 'queue';

const queue = async (token: string): Promise<Track[]> => {
  const res = await jukeboxClient.get<GetQueueResponse>(baseURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export { queue };
