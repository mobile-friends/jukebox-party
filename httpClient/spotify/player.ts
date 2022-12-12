import { spotifyClient } from '.';

const baseURL = 'me/player';

const currentlyPlaying = async (token: string) => {
  const res = await spotifyClient.get(`${baseURL}/currently-playing`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const recentlyPlayed = async (token: string) => {
  const now = Date.now();
  const res = await spotifyClient.get(
    `${baseURL}/recently-played?limit=5&before=${now}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

const playbackState = async (token: string) => {
  const res = await spotifyClient.get(`${baseURL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

export { currentlyPlaying, recentlyPlayed, playbackState, play, pause };
