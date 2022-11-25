import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import { joinParty } from '../httpClient/jukebox/parties';
import { Party } from '../lib/party';

// import Input from '../components/elements/input';
// import Button from '../components/elements/button';
// import styles from '../styles/pages/index.module.scss';

export default function Home({ context }) {
  const [userName, setUserName] = useState<string>('');
  const [partyCode, setPartyCode] = useState<string>('');
  const router = useRouter();

  return (
    <div>
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
          <Input
            placeholder='Name'
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <Input
            placeholder='Session id'
            onChange={(e) => {
              setPartyCode(e.target.value);
            }}
          />
          <Button
            text='Join session'
            type='primary'
            onClick={async () => {
              const joinedRoom: Party = await joinParty(partyCode, userName);
              router.push(`/party/${joinedRoom.code}`);
            }}
          />
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
