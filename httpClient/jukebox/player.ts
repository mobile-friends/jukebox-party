import { jukeboxClient } from '.';

const baseURL = 'me/player';

const currentlyPlaying = async (token: string) => {
  const res = await jukeboxClient.get(`${baseURL}/currently-playing`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const recentlyPlayed = async (token: string) => {
  const now = Date.now();
  const res = await jukeboxClient.get(
    `${baseURL}/recently-played?limit=1&after=${now}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export { currentlyPlaying, recentlyPlayed };
