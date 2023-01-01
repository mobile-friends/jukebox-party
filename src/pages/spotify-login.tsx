import { GetServerSideProps } from 'next/types';
import * as querystring from 'querystring';
import axios from 'axios';
import { SpotifyClient } from '@common/spotifyClient';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface SpotifyTokenData {
  access_token: SpotifyToken;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
}

interface ErrorProps {
  kind: 'Error';
  error: string;
}

interface WaitForPlayingProps {
  kind: 'WaitForPlaying';
  spotifyToken: SpotifyToken;
}

type Props = ErrorProps | WaitForPlayingProps;

const Scope =
  'user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative';

function makePartyUrl(spotifyToken: SpotifyToken) {
  return `/create-party?${querystring.stringify({
    token: spotifyToken,
  })}`;
}

export default function SpotifyLogin(props: Props) {
  const router = useRouter();

  async function checkIfPlaying(spotifyToken: SpotifyToken) {
    const isPlaying = await SpotifyClient.isCurrentlyPlaying(spotifyToken);
    if (isPlaying) {
      const partyUrl = makePartyUrl(spotifyToken);
      await router.push(partyUrl);
    }
  }

  useEffect(() => {
    if (props.kind === 'WaitForPlaying') {
      const interval = setInterval(
        () => checkIfPlaying(props.spotifyToken),
        1000
      );
      return () => clearInterval(interval);
    }
  });

  if (props.kind === 'Error') return <div>{props.error}</div>;
  else if (props.kind === 'WaitForPlaying') {
    return (
      <div>
        To start, please make sure you are currently playing a song on your
        device.
      </div>
    );
  } else return <div>Connecting to spotify...</div>;
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
    const spotifyToken = tokenData.access_token;

    const isPlaying = await SpotifyClient.isCurrentlyPlaying(spotifyToken);
    if (isPlaying) {
      const redirectUrl = makePartyUrl(spotifyToken);
      return {
        props: {} as Props,
        redirect: {
          destination: redirectUrl,
        },
      };
    } else {
      return {
        props: { kind: 'WaitForPlaying', spotifyToken },
      };
    }
  } else if ('error' in query) {
    // The request failed
    const error = query.error as string;
    return { props: { kind: 'Error', error } };
  } else {
    // Send first auth request
    return {
      props: {} as Props,
      redirect: {
        destination: spotifyUserAuthUrl(),
      },
    };
  }
};
