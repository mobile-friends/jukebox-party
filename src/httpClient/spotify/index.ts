import axios from 'axios';

const spotifyClient = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: (_) => true,
});

export { spotifyClient };
