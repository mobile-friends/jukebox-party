import { getProviders, getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import { joinParty } from '../httpClient/jukebox/parties';
import { Party } from '../lib/party';
import styles from '../styles/pages/main.module.scss';

export default function SearchTrack({ provider }) {
  const [queryString, setQueryString] = useState<string>('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    console.log('session', session);
  }, [session, null]);

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          search.<span className='text-primary text-italic'>track</span>
        </h1>
        <div className={styles.container}>
          <Input
            placeholder='What do you want to listen to?'
            onChange={(e) => {
              setQueryString(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return { props: { provider: providers?.spotify } };
}
