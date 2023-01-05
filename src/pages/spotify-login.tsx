import { GetServerSideProps } from 'next/types';
import * as querystring from 'querystring';
import axios from 'axios';
import { SpotifyClient } from '@common/spotifyClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Env } from '@common/env';
import { SpotifyUser } from '@common/types/user';
import React from 'react';
import styles from '../styles/pages/spotifyLogin.module.scss';
import Button from '@component/elements/button';

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
  spotifyUser: SpotifyUser;
}

type Props = ErrorProps | WaitForPlayingProps;

const Scope =
  'user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative';

function makePartyUrl(spotifyToken: SpotifyToken) {
  return `/create-party?${querystring.stringify({
    token: spotifyToken,
  })}`;
}

function isWaitingForPlaying(props: Props): props is WaitForPlayingProps {
  return props.kind === 'WaitForPlaying';
}

function isError(props: Props): props is ErrorProps {
  return props.kind === 'Error';
}

export default function SpotifyLogin(props: Props) {
  const router = useRouter();
  const [spotifyAccountType, setSpotifyAccountType] = useState('');

  function goBackToStart() {
    router.push('/').catch(console.error);
  }

  function goToLogin() {
    router.push({
      pathname: '/spotify-login',
      query: { newLogin: 'true' },
    });
  }

  async function checkIfPlaying(spotifyToken: SpotifyToken) {
    const isPlaying = await SpotifyClient.isCurrentlyPlaying(spotifyToken);
    if (isPlaying) {
      const partyUrl = makePartyUrl(spotifyToken);
      await router.push(partyUrl);
    }
  }

  useEffect(() => {
    if (isWaitingForPlaying(props)) {
      const interval = setInterval(() => {
        setSpotifyAccountType(props.spotifyUser.account_type);

        if (spotifyAccountType === 'premium')
          checkIfPlaying(props.spotifyToken);
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  if (isError(props)) return <div>Fehler: {props.error}</div>;
  else if (spotifyAccountType !== '') {
    if (spotifyAccountType !== 'premium') {
      return (
        <div className={`text-center ${styles.container}`}>
          <h2 className='text-primary'>
            It looks like this is no premium account
          </h2>
          <span>To use jukebox.party you must have a premium account.</span>

          <Button
            content={'Log in with premium account'}
            styleType={'primary'}
            onClick={goToLogin}
          />
          <Button
            content={'Be part of a party'}
            styleType={'tertiary'}
            onClick={goBackToStart}
          />
        </div>
      );
    } else if (spotifyAccountType === 'premium' && isWaitingForPlaying(props)) {
      return (
        <div className={`text-center ${styles.container}`}>
          <h2 className='text-primary'>Press play in the Spotify app</h2>
          <span>
            Click play on the output device of your choice (laptop, smartphone,
            ...), so we know which output device we may use.
          </span>
        </div>
      );
    }
  } else
    return (
      <div className={`${styles.container}`}>Connecting to spotify...</div>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  function base64(s: string): string {
    return new Buffer(s).toString('base64');
  }

  function redirectUrl(): string {
    // TODO: Use dynamic port [JUKE-138]
    return Env.isProduction()
      ? `https://jukebox.herokuapp.com/spotify-login`
      : `http://localhost:3000/spotify-login`;
  }

  function spotifyUserAuthUrl() {
    // developer.spotify.com/documentation/general/guides/authorization/code-flow#request-user-authorization
    const query = querystring.stringify({
      response_type: 'code',
      client_id: Env.spotifyClientId(),
      scope: Scope,
      redirect_uri: redirectUrl(),
    });
    return `https://accounts.spotify.com/authorize?${query}`;
  }

  function newSpotifyUserAuthUrl() {
    // developer.spotify.com/documentation/general/guides/authorization/code-flow#request-user-authorization
    const query = querystring.stringify({
      response_type: 'code',
      client_id: Env.spotifyClientId(),
      scope: Scope,
      redirect_uri: redirectUrl(),
      show_dialog: true,
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
    const authorization = `Basic ${base64(
      `${Env.spotifyClientId()}:${Env.spotifyClientSecret()}`
    )}`;
    const res = await axios.post<SpotifyTokenData>(url, data, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // TODO: Handle errors [JUKE-139]
    return res.data;
  }

  if ('newLogin' in query) {
    return {
      props: {} as Props,
      redirect: {
        destination: newSpotifyUserAuthUrl(),
      },
    };
  } else if ('code' in query) {
    // The request succeeded
    const code = query.code as string;
    const tokenData = await requestAccessToken(code);
    const spotifyToken = tokenData.access_token;

    const isPlaying = await SpotifyClient.isCurrentlyPlaying(spotifyToken);
    const spotifyUser: SpotifyUser = await SpotifyClient.getSpotifyUserInfo(
      spotifyToken
    );

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
        props: { kind: 'WaitForPlaying', spotifyToken, spotifyUser },
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
