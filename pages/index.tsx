import {
  ClientSafeProvider,
  getProviders,
  getSession,
  signIn,
  useSession,
} from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import { sendJoinPartyRequest } from '../httpClient/jukebox/parties';
import { Party } from '../lib/party';
import styles from '../styles/pages/main.module.scss';
import { GetServerSideProps } from 'next';
import { GetServerSidePropsResult } from 'next/types';

interface IndexProps {
  provider: ClientSafeProvider;
}

export default function Home({ provider }: IndexProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [partyCode, setPartyCode] = useState<string>('');

  function goToLogin() {
    signIn(provider.id, { callbackUrl: '/create-party' }).catch(console.log);
  }

  async function goToPartyPage() {
    await router.push(`/party/${partyCode}`);
  }

  async function joinParty() {
    await sendJoinPartyRequest(partyCode, username);
    await goToPartyPage();
  }

  function onUsernameInput(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function onPartyCodeInout(e: ChangeEvent<HTMLInputElement>) {
    setPartyCode(e.target.value);
  }

  function onJoinPartyClicked() {
    joinParty().catch(console.log);
  }

  function onCreatePartyClicked() {
    goToLogin();
  }

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          jukebox.<span className='text-primary text-italic'>party</span>
        </h1>
        <form>
          <Input placeholder='Name' onChange={onUsernameInput} />
          <Input placeholder='Party code' onChange={onPartyCodeInout} />
          <Button
            text='Join party'
            type='primary'
            onClick={onJoinPartyClicked}
          />
        </form>
        <Button
          text='Create party'
          type='tertiary'
          onClick={onCreatePartyClicked}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<IndexProps>
> {
  const providers = await getProviders();
  const props: IndexProps = { provider: providers.spotify };
  return { props };
}
