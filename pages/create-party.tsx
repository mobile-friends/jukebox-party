import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import { createParty } from '../httpClient/jukebox/parties';
import { Party } from '../lib/party';
import styles from '../styles/pages/main.module.scss';

type Props = {};

function CreateParty({}: Props) {
  const router = useRouter();
  const [partyName, setPartyName] = useState<string>('');
  const [partyHostName, setPartyHostName] = useState<string>('');
  const { data: session } = useSession();

  useEffect(() => {
    console.log('session', session);
  }, [session, null]);

  const clickBack = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          create.<span className='text-primary text-italic'>party</span>
        </h1>
        <form>
          <Input
            placeholder='Party Name'
            onChange={(e) => {
              setPartyName(e.target.value);
            }}
          />
          <Input
            placeholder='Host Name'
            onChange={(e) => {
              setPartyHostName(e.target.value);
            }}
          />
          <Button
            text='Create party'
            type='primary'
            onClick={async () => {
              const party: Party = await createParty(partyName, partyHostName);
              router.push(`/party/${encodeURIComponent(party.code)}`);
            }}
          />
        </form>
        <Button
          text='Back'
          type='tertiary'
          onClick={() => {
            clickBack();
          }}
        />
      </div>
    </div>
  );
}

export default CreateParty;
