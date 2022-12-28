import { PlaybackState } from '@common/types/playbackState';
import { jukeboxClient } from '@httpClient/jukebox/index';
import { GetPlaybackResult } from '@endpoint/getPlayback/dto';
import { isSuccess } from '@common/infrastructure/response';
import { PauseResult } from '@endpoint/pause/dto';
import { NoBody } from '@common/infrastructure/requestHandler';

export async function getPlayback(): Promise<PlaybackState> {
  const response = await jukeboxClient.get<GetPlaybackResult>('/player/');
  if (isSuccess(response)) return response.data.playbackState;
  else {
    console.error(response); // TODO: Handle errors
    throw new Error('Error not handled');
  }
}

export async function pause(): Promise<void> {
  const response = await jukeboxClient.put<NoBody, PauseResult>(
    '/player/pause',
    {}
  );
  if (isSuccess(response)) return;
  else {
    console.error(response); // TODO: Handle errors
    throw new Error('Error not handled');
  }
}

export async function play(): Promise<void> {
  const response = await jukeboxClient.put<NoBody, PauseResult>(
    '/player/play',
    {}
  );
  if (isSuccess(response)) return;
  else {
    console.error(response); // TODO: Handle errors
    throw new Error('Error not handled');
  }
}
