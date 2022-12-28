import axios from 'axios';

export type SpotifyResponse<T> = T | SpotifyApi.ErrorObject;

interface SpotifyClient {
  get<T>(url: string, token: string): Promise<SpotifyResponse<T>>;

  post<T>(url: string, token: string): Promise<SpotifyResponse<T>>;

  put<T>(url: string, token: string): Promise<SpotifyResponse<T>>;
}

const axiosClient = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: (_) => true,
});

const spotifyClient: SpotifyClient = {
  get<T>(url: string, token: string): Promise<SpotifyResponse<T>> {
    return axiosClient
      .get<T>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((it) => it.data);
  },
  post<T>(url: string, token: string): Promise<SpotifyResponse<T>> {
    return axiosClient
      .post<T>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((it) => it.data);
  },
  put<T>(url: string, token: string): Promise<SpotifyResponse<T>> {
    return axiosClient
      .put<T>(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((it) => it.data);
  },
};

export { spotifyClient };
