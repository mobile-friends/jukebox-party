import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import Button from '../common/components/elements/button';
import Input from '../common/components/elements/input';
import { sendJoinPartyRequest } from '../common/httpClient/jukebox/parties';
import styles from '../styles/pages/main.module.scss';
import { GetServerSideProps } from 'next/types';

interface Props {
  provider: ClientSafeProvider;
}

export default function Home({ provider }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [partyCode, setPartyCode] = useState<string>('');

  function goToLogin() {
    signIn(provider.id, { callbackUrl: '/create-party' }).catch(console.log);
  }

  async function goToPartyPage() {
    await router.push(`/party/${partyCode}`);
  }

  async function goTo404() {
    await router.push(`/party/404`);
  }

  async function joinParty() {
    const success = await sendJoinPartyRequest(partyCode, username);
    if (success) await goToPartyPage();
    else await goTo404();
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const providers = await getProviders();
  if (providers === null) throw new Error('Could not get spotify providers');
  return { props: { provider: providers.spotify } };
};
