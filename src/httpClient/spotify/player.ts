import { spotifyClient } from '.';
import { Track } from '@common/types/track';
import { parseTrack } from '@common/spotifyParsing';
import { isSpotifyError } from '@common/util/typeGuards';
import CurrentlyPlayingResponse = SpotifyApi.CurrentlyPlayingResponse;

const baseURL = 'me/player';

const currentlyPlaying = async (token: string): Promise<Track | null> => {
  const response = await spotifyClient.get<CurrentlyPlayingResponse>(
    `${baseURL}/currently-playing`,
    token
  );
  if (!isSpotifyError(response)) {
    const playingItem = response.item;
    if (playingItem === null || playingItem === undefined) return null;
    else if (playingItem.type === 'track') return parseTrack(playingItem);
    else return null;
  } else {
    // TODO: Handle errors
    return null;
  }
};

const recentlyPlayed = async (token: string): Promise<string[]> => {
  const now = Date.now();
  const response =
    await spotifyClient.get<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
      `${baseURL}/recently-played?limit=5&before=${now}`,
      token
    );
  if (!isSpotifyError(response)) return response.items.map((it) => it.track.id);
  // TODO: Handle error
  else return [];
};

const playbackState = async (
  token: string
): Promise<SpotifyApi.CurrentPlaybackResponse | null> => {
  const response = await spotifyClient.get<SpotifyApi.CurrentPlaybackResponse>(
    `${baseURL}`,
    token
  );
  if (!isSpotifyError(response)) return response;
  // TODO: Handle error
  else return null;
};

const play = async (token: string) => {
  return await spotifyClient.put<string>(`${baseURL}/play`, token);
};

const pause = async (token: string) => {
  return await spotifyClient.put<string>(`${baseURL}/pause`, token);
};

const nextTrack = async (token: string) => {
  return await spotifyClient.post<string>(`${baseURL}/next`, token);
};

const previousTrack = async (token: string) => {
  return await spotifyClient.post<string>(`${baseURL}/previous`, token);
};

export {
  currentlyPlaying,
  recentlyPlayed,
  playbackState,
  play,
  pause,
  nextTrack,
  previousTrack,
};
