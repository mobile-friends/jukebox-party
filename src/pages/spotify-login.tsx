import { GetServerSideProps } from 'next/types';
import * as querystring from 'querystring';
import axios from 'axios';
import { SpotifyClient } from '@common/spotifyClient';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Env } from '@common/env';
import { SpotifyUser } from '@common/types/user';
import styles from '../styles/pages/spotifyLogin.module.scss';
import Button from '@component/elements/button';
import { PagePath } from '@common/pagePath';

interface SpotifyTokenData {
  access_token: SpotifyToken;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: SpotifyRefreshToken;
}

interface ErrorProps {
  kind: 'Error';
  error: string;
}

interface WaitForPlayingProps {
  kind: 'WaitForPlaying';
  spotifyToken: SpotifyToken;
  refreshToken: SpotifyRefreshToken;
  spotifyUser: SpotifyUser;
}

type Props = ErrorProps | WaitForPlayingProps;

const Scope =
  'user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative';

function isWaitingForPlaying(props: Props): props is WaitForPlayingProps {
  return props.kind === 'WaitForPlaying';
}

function isError(props: Props): props is ErrorProps {
  return props.kind === 'Error';
}

export default function SpotifyLoginPage(props: Props) {
  const router = useRouter();
  const [spotifyAccountType, setSpotifyAccountType] = useState('');

  function goBackToStart() {
    router.push(PagePath.Home).catch(console.error);
  }

  function goToLogin() {
    router.push(PagePath.spotifyLogin(true));
  }

  async function checkIfPlaying(
    spotifyToken: SpotifyToken,
    refresh: SpotifyRefreshToken
  ) {
    const isPlaying = await SpotifyClient.isCurrentlyPlaying(spotifyToken);
    if (isPlaying) {
      await router.push(PagePath.createParty(spotifyToken, refresh));
    }
  }

  useEffect(() => {
    if (isWaitingForPlaying(props)) {
      const interval = setInterval(() => {
        setSpotifyAccountType(props.spotifyUser.account_type);

        if (spotifyAccountType === 'premium')
          checkIfPlaying(props.spotifyToken, props.refreshToken);
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  if (isError(props)) return <div>Fehler: {props.error}</div>;
  else if (spotifyAccountType !== '') {
    if (spotifyAccountType !== 'premium') {
      return (
        <div className={`text-center ${styles.container}`}>
          <h3>
            Hi{' '}
            <span className='text-italic'>
              {props.spotifyUser.nickname === 'undefined'
                ? ''
                : props.spotifyUser.nickname}
            </span>
            !
          </h3>
          {props.spotifyUser.email === 'undefined' ? (
            <></>
          ) : (
            <span className='text-muted'>
              Account of {props.spotifyUser.email}
            </span>
          )}

          <h2 className='text-primary'>
            It looks like this is no premium account
          </h2>

          <p>Choose &apos;Not you?&apos; and log in with premium account</p>
          <Button
            content={'Log in with premium account'}
            styleType={'primary block'}
            onClick={goToLogin}
          />
          <p>or</p>
          <Button
            content={'Be part of a party'}
            styleType={'secondary block'}
            onClick={goBackToStart}
          />
        </div>
      );
    } else if (spotifyAccountType === 'premium' && isWaitingForPlaying(props)) {
      return (
        <div className={`text-center ${styles.container}`}>
          <h3>
            Hi{' '}
            <span className='text-italic'>
              {props.spotifyUser.nickname === 'undefined'
                ? ''
                : props.spotifyUser.nickname}
            </span>
            !
          </h3>
          {props.spotifyUser.email === 'undefined' ? (
            <></>
          ) : (
            <span className='text-muted'>
              Account of {props.spotifyUser.email}
            </span>
          )}

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
      <div className={`text-center ${styles.container}`}>
        Connecting to spotify...
      </div>
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

  if ('newLogin' in query && query['newLogin'] === 'true') {
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
      return {
        props: {} as Props,
        redirect: {
          destination: PagePath.createParty(
            spotifyToken,
            tokenData.refresh_token
          ),
        },
      };
    } else {
      return {
        props: {
          kind: 'WaitForPlaying',
          spotifyToken,
          refreshToken: tokenData.refresh_token,
          spotifyUser,
        },
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
