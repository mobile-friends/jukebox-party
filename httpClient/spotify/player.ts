import { spotifyClient } from '.';

const baseURL = 'player';

const currentlyPlaying = async (context) => {
  const res = await spotifyClient.get(`${baseURL}/currentlyPlaying`);
  return res.data;
};

export { currentlyPlaying };
