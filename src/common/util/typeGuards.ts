import { AxiosError, AxiosResponse } from 'axios';

export function isSpotifyError<T extends {}>(
  response: T | SpotifyApi.ErrorObject
): response is SpotifyApi.ErrorObject {
  return 'error' in response;
}
