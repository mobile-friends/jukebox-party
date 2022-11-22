import { getSession, useSession } from 'next-auth/react';
import { createParty, getPartyDetails } from '../httpClient/jukebox/parties';

import LoginButton from '../components/elements/loginButton';

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
    <div
      style={{
        height: '100vh',
        padding: '4rem',
      }}
    >
      {/* <div
        style={{
          height: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <h1 className='text-center'>
          jukebox.<span className='text-primary text-italic'>party</span>
        </h1>

        <form>
          <Input placeholder='Name'></Input>
          <Input placeholder='Session id'></Input>
          <Button text='Join session' type='primary'></Button>
        </form>

        <Button text='Create session' type='tertiary'></Button>
      </div> */}

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
        <div
          onClick={async () => {
            await getPartyDetails('673994');
          }}
        >
          get party details
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
