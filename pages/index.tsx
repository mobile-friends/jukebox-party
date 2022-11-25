import { getSession, useSession } from 'next-auth/react';
import {
  createParty,
  getPartyDetails,
  joinParty,
} from '../httpClient/jukebox/parties';

import LoginButton from '../components/elements/loginButton';
import Input from '../components/elements/input';
import Button from '../components/elements/button';

import styles from '../styles/pages/index.module.scss';

export default function Home({ context }) {
  const play = () => {
    fetch('http://localhost:3000/api/player/play', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.user.accessToken}`,
      },
    });
  };

  const pause = () => {
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.user.accessToken}`,
      },
    });
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          jukebox.<span className='text-primary text-italic'>party</span>
        </h1>

        <form>
          <Input placeholder='Name'/>
          <Input placeholder='Session id'/>
          <Button text='Join session' type='primary'/>
        </form>

        <Button text='Create session' type='tertiary'/>
      </div>

      <div>
        <h1>jukebox.party</h1>
        <div onClick={play}>PLAY</div>
        <br></br>
        <div onClick={pause}>PAUSE</div>
        <br></br>
        <div
          onClick={async () => {
            await createParty('my party', 'my name');
          }}
        >
          Create Room
        </div>
        <br></br>
        <div
          onClick={async () => {
            await getPartyDetails('581398');
          }}
        >
          get party details
        </div>
        <br></br>
        <div
          onClick={async () => {
            await joinParty('581398', 'bruh');
          }}
        >
          Join Party(581398)
        </div>
        <br></br>
        <LoginButton />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      context: await getSession(context),
    },
  };
}
