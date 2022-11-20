import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
/*
httpClient.interceptors.request.use(
  async (config) => {
    console.log('INTERECEPTOR REQUEST');

    // Get the token from the store - TODO
    let apiObject = '';

    config.headers['Authorization'] = 'Bearer ' + apiObject;

    return config;
  },

  (error) => Promise.reject(error)
);
*/
export default httpClient;
