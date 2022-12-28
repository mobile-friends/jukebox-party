import { spotifyClient } from '.';
import { Track } from '@common/types/track';
import { parseTrack } from '@common/spotifyParsing';
import { isSpotifyError } from '@common/util/typeGuards';

//TODO: Move spotify requests to backend

const currentlyPlaying = async (token: string): Promise<Track | null> => {
  const response = await spotifyClient.get<
    SpotifyApi.CurrentlyPlayingResponse | ''
  >(`me/player/currently-playing`, token);
  if (isSpotifyError(response)) {
    // TODO: Handle errors
    console.error(response);
    return null;
  }

  // Sometimes spotify returns a 204 (no content) when trying to get the track
  // In that case, data will be empty. Return null for now
  // TODO: Think of a better solution
  if (response === '') return null;

  const playingItem = response.item;
  if (playingItem === null || playingItem === undefined) return null;
  else if (playingItem.type === 'track') return parseTrack(playingItem);
  else return null;
};

const recentlyPlayed = async (token: string): Promise<string[]> => {
  const now = Date.now();
  const response =
    await spotifyClient.get<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
      `me/player/recently-played?limit=5&before=${now}`,
      token
    );
  if (!isSpotifyError(response)) return response.items.map((it) => it.track.id);
  // TODO: Handle error
  else return [];
};

const nextTrack = async (token: string) => {
  return await spotifyClient.post<string>(`me/player/next`, token);
};

const previousTrack = async (token: string) => {
  return await spotifyClient.post<string>(`me/player/previous`, token);
};

export { currentlyPlaying, recentlyPlayed, nextTrack, previousTrack };
