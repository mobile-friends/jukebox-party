import { GetServerSideProps } from 'next/types';
import * as querystring from 'querystring';
import axios from 'axios';

interface SpotifyTokenData {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
}

interface Props {
  error: string | null;
}

const Scope =
  'user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative';

export default function SpotifyLogin(props: Props) {
  if (props.error) return <div>{props.error}</div>;
  else return <div>Connecting to spotify...</div>;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  function clientId(): string {
    const id = process.env.SPOTIFY_CLIENT_ID;
    if (id !== undefined) return id;
    else throw new Error('SPOTIFY_CLIENT_ID env not defined');
  }

  function clientSecret(): string {
    const secret = process.env.SPOTIFY_CLIENT_SECRET;
    if (secret !== undefined) return secret;
    else throw new Error('SPOTIFY_CLIENT_SECRET env not defined');
  }

  function base64(s: string): string {
    return new Buffer(s).toString('base64');
  }

  function redirectUrl(): string {
    // TODO: Use dynamic ip/port
    return `http://localhost:3000/spotify-login`;
  }

  function spotifyUserAuthUrl() {
    // developer.spotify.com/documentation/general/guides/authorization/code-flow#request-user-authorization
    const query = querystring.stringify({
      response_type: 'code',
      client_id: clientId(),
      scope: Scope,
      redirect_uri: redirectUrl(),
    });
    return `https://accounts.spotify.com/authorize?${query}`;
  }

  async function requestAccessToken(code: string): Promise<SpotifyTokenData> {
    // developer.spotify.com/documentation/general/guides/authorization/code-flow#request-access-token
    const url = 'https://accounts.spotify.com/api/token';
    const data = querystring.stringify({
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUrl(),
    });
    const authorization = `Basic ${base64(`${clientId()}:${clientSecret()}`)}`;
    const res = await axios.post<SpotifyTokenData>(url, data, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // TODO: Handle errors
    return res.data;
  }

  if ('code' in query) {
    // The request succeeded
    const code = query.code as string;
    const tokenData = await requestAccessToken(code);
    const redirectUrl = `/create-party?${querystring.stringify({
      token: tokenData.access_token,
      refresh: tokenData.refresh_token,
    })}`;
    return {
      props: { error: null },
      redirect: {
        destination: redirectUrl,
      },
    };
  } else if ('error' in query) {
    // The request failed
    const error = query.error as string;
    return { props: { error } };
  } else {
    // Send first auth request
    return {
      props: { error: null },
      redirect: {
        destination: spotifyUserAuthUrl(),
      },
    };
  }
};
