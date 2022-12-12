import { ClientSafeProvider, getProviders, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Input from '../components/elements/input';
import TrackListItemView from '../components/elements/trackListItemView';
import { search } from '../httpClient/jukebox/search';
import { Track } from '../lib/track';
import styles from '../styles/pages/main.module.scss';
import { GetServerSideProps } from 'next/types';
import Navbar from '../components/elements/navbar';

interface Props {
  provider: ClientSafeProvider;
}

type QueryString = string;

const MinQueryLength = 4;

function isValidQueryString(s: string): s is QueryString {
  return s.length >= MinQueryLength;
}

export default function SearchTrack({ provider }: Props) {
  const [queryString, setQueryString] = useState<QueryString | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const router = useRouter();
  let { data: session } = useSession() as any;

  const onQueryInputChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const newQueryString = isValidQueryString(input) ? input : null;
    setQueryString(newQueryString);
  };

  useEffect(() => {
    if (queryString === null) return;

    search(queryString, 'track', session.user.accessToken)
      .then(setTracks)
      .catch((e) => {
        console.error(e);
        setTracks([]);
      });
  }, [queryString]);

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          search.<span className='text-primary text-italic'>track</span>
        </h1>
        <div className={styles.container} style={{ padding: 0 }}>
          <Input
            placeholder='What do you want to listen to?'
            onChange={onQueryInputChanged}
          />
          <ul style={{ overflow: 'scroll' }}>
            {tracks?.map((track) => (
              <TrackListItemView track={track} />
            ))}
          </ul>
        </div>
      </div>

      <Navbar />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const providers = await getProviders();
  if (providers === null) throw new Error('Could not get spotify providers');

  return { props: { provider: providers.spotify } };
};
