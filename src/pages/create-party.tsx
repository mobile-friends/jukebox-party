import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import { createParty } from '@common/../httpClient/jukebox/parties';
import styles from '../styles/pages/main.module.scss';
import { PartyCode } from '@common/types/partyCode';

type Props = {};

function CreateParty({}: Props) {
  const router = useRouter();
  const [partyName, setPartyName] = useState<string>('');
  const [partyHostName, setPartyHostName] = useState<string>('');
  const { data: session } = useSession();

  useEffect(() => {
    console.log('session', session);
  }, [session, null]);

  function onBackClicked() {
    signOut({ callbackUrl: '/' }).catch(console.log);
  }

  function onPartyNameChanged(e: ChangeEvent<HTMLInputElement>) {
    setPartyName(e.target.value);
  }

  function onHostNameChanged(e: ChangeEvent<HTMLInputElement>) {
    setPartyHostName(e.target.value);
  }

  async function goToPartyPage(partyCode: PartyCode) {
    await router.push(`/party/${encodeURIComponent(partyCode)}`);
  }

  async function onCreatePartyClicked() {
    const partyCode = await createParty(partyName, partyHostName);
    await goToPartyPage(partyCode);
  }

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          create.<span className='text-primary text-italic'>party</span>
        </h1>
        <form>
          <Input placeholder='Party Name' onChange={onPartyNameChanged} />
          <Input placeholder='Host Name' onChange={onHostNameChanged} />
          <Button
            text='Create party'
            type='primary'
            onClick={onCreatePartyClicked}
          />
        </form>
        <Button text='Back' type='tertiary' onClick={onBackClicked} />
      </div>
    </div>
  );
}

export default CreateParty;
