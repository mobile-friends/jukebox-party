import { jukeboxClient } from '.';
import { Track } from '@common/types/track';
import { GetQueueResponse } from '@endpoint/getQueue/dto';
import { isSuccessResponse } from '@common/apiResponse';

const baseURL = 'queue';

const queue = async (token: string): Promise<Track[]> => {
  const response = await jukeboxClient.get<GetQueueResponse>(baseURL, token);
  if (isSuccessResponse(response)) return response;
  // TODO: Handle errors
  else return [];
};

export { queue };
