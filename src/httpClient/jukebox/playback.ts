import { PlaybackState } from '@common/types/playbackState';
import { jukeboxClient } from '@httpClient/jukebox/index';
import { GetPlaybackResult } from '@endpoint/getPlayback/dto';
import { isSuccess } from '@common/infrastructure/response';
import { PauseResult } from '@endpoint/pause/dto';
import { NoBody } from '@common/infrastructure/requestHandler';

export async function getPlayback(
  spotifyToken: string
): Promise<PlaybackState> {
  const response = await jukeboxClient.get<GetPlaybackResult>(
    '/player/',
    spotifyToken
  );
  if (isSuccess(response)) return response.data.playbackState;
  else {
    console.error(response); // TODO: Handle errors
    throw new Error('Error not handled');
  }
}

export async function pause(spotifyToken: string): Promise<void> {
  const response = await jukeboxClient.put<NoBody, PauseResult>(
    '/player/pause',
    {},
    spotifyToken
  );
  if (isSuccess(response)) return;
  else {
    console.error(response); // TODO: Handle errors
    throw new Error('Error not handled');
  }
}

export async function play(spotifyToken: string): Promise<void> {
  const response = await jukeboxClient.put<NoBody, PauseResult>(
    '/player/play',
    {},
    spotifyToken
  );
  if (isSuccess(response)) return;
  else {
    console.error(response); // TODO: Handle errors
    throw new Error('Error not handled');
  }
}
