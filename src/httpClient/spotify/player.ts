import { spotifyClient } from '.';
import { Track } from '@common/types/track';
import { parseTrack } from '@common/spotifyParsing';
import CurrentlyPlayingResponse = SpotifyApi.CurrentlyPlayingResponse;

const baseURL = 'me/player';

const currentlyPlaying = async (token: string): Promise<Track | null> => {
  const res = await spotifyClient.get<CurrentlyPlayingResponse>(
    `${baseURL}/currently-playing`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const playingItem = res.data.item;
  if (playingItem === null) return null;
  else if (playingItem.type === 'track') return parseTrack(playingItem);
  else return null;
};

const recentlyPlayed = async (token: string): Promise<string[]> => {
  const now = Date.now();
  const res =
    await spotifyClient.get<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
      `${baseURL}/recently-played?limit=5&before=${now}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  return res.data.items.map((it) => it.track.id);
};

const playbackState = async (
  token: string
): Promise<SpotifyApi.CurrentPlaybackResponse> => {
  const res = await spotifyClient.get<SpotifyApi.CurrentPlaybackResponse>(
    `${baseURL}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

const play = async (token: string) => {
  const res = await spotifyClient.put(
    `${baseURL}/play`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const pause = async (token: string) => {
  const res = await spotifyClient.put(
    `${baseURL}/pause`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const nextTrack = async (token: string) => {
  const res = await spotifyClient.post(
    `${baseURL}/next`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const previousTrack = async (token: string) => {
  const res = await spotifyClient.post(
    `${baseURL}/previous`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
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
