import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Button from '../components/elements/button';
import Input from '../components/elements/input';

// import Input from '../components/elements/input';
// import Button from '../components/elements/button';
// import styles from '../styles/pages/index.module.scss';

export default function Home({ context }) {
  const router = useRouter();

  // const play = () => {
  //   fetch('http://localhost:3000/api/player/play', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${context.user.accessToken}`,
  //     },
  //   });
  // };

  // const pause = () => {
  //   fetch('https://api.spotify.com/v1/me/player/pause', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${context.user.accessToken}`,
  //     },
  //   });
  // };

  return (
    <div
    // style={{
    //   height: '100vh',
    //   padding: '4rem',
    // }}
    >
      <div
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
          <Input placeholder='Name' />
          <Input placeholder='Session id' />
          <Button text='Join session' type='primary' />
        </form>

        <Button
          text='Create session'
          type='tertiary'
          onClick={() => {
            router.push('/create-party');
          }}
        />
      </div>

      <div>
        {/* <h1>jukebox.party</h1>
        <div onClick={play}>PLAY</div>
        <br></br>
        <div onClick={pause}>PAUSE</div>
        <br></br>
        <input type='text' />
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
        <LoginButton /> */}
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
