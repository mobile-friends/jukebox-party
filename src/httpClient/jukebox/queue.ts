import { jukeboxClient } from '.';
import { Track } from '@common/types/track';
import { GetQueueResult } from '@endpoint/getQueue/dto';
import { isSuccess } from '@common/infrastructure/response';

export const queue = async (): Promise<Track[]> => {
  const response = await jukeboxClient.get<GetQueueResult>('queue');
  if (isSuccess(response)) {
    return response.data.tracks;
  } else {
    console.error(response); // TODO: Handle errors
    throw new Error('Error not handled');
  }
};
