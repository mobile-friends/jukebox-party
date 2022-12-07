import { spotifyClient } from '.';

const recommendations = async (
  artists: string,
  tracks: string,
  token: string
) => {
  const res = await spotifyClient.get(
    `/recommendations?limit=1&seed_artists=${artists}&seed_tracks=${tracks}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export { recommendations };
