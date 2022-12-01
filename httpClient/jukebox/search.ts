import { jukeboxClient } from '.';

const baseURL = 'search';

const search = async (q: string, type: string, token: string) => {
  q = encodeURIComponent(q);
  type = encodeURIComponent(type);
  const res = await jukeboxClient.get(`${baseURL}?q=${q}&type=${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res?.data;
};

export { search };
