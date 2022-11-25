import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import { joinParty } from '../httpClient/jukebox/parties';
import { Party } from '../lib/party';
import styles from '../styles/pages/index.module.scss';

export default function Home({ context }) {
  const [userName, setUserName] = useState<string>('');
  const [partyCode, setPartyCode] = useState<string>('');
  const router = useRouter();

  return (
    <div>
      <div className={styles.container}>
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
