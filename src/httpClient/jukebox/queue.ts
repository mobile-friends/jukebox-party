import { jukeboxClient } from '.';
import { Track } from '@common/types/track';
import { GetQueueResult } from '@endpoint/getQueue/dto';
import { isSuccess } from '@common/infrastructure/response';

const queue = async (token: string): Promise<Track[]> => {
  const response = await jukeboxClient.get<GetQueueResult>('queue', token);
  if (isSuccess(response)) {
    return response.data.tracks;
  } else {
    console.error(response); // TODO: Handle errors
    throw new Error('Error not handled');
  }
};

export { queue };
