import { getSession, useSession } from 'next-auth/react';

import LoginButton from '../components/loginButton';

export default function Home({ context: { user } }) {
  const { data: context } = useSession();
  console.log(context);

  const play = () => {
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
  };

  const pause = () => {
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
  };

  return (
    <div>
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
