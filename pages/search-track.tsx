import { ClientSafeProvider, getProviders, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Input from '../components/elements/input';
import TrackListItemView from '../components/elements/trackListItemView';
import { search } from '../httpClient/jukebox/search';
import { Track } from '../lib/track';
import styles from '../styles/pages/main.module.scss';
import { GetServerSideProps } from 'next/types';

interface Props {
  provider: ClientSafeProvider;
}

export default function SearchTrack({ provider }: Props) {
  const [queryString, setQueryString] = useState<string>('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const router = useRouter();
  let { data: session } = useSession() as any;

  const typeInput = async (e: any) => {
    setQueryString(e.target.value);
    if (queryString?.length <= 3) return;
    try {
      const tracks = await search(
        queryString,
        'track',
        session.user.accessToken
      );
      setTracks(tracks);
    } catch (e) {
      console.log(e);
      setTracks([]);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          search.<span className='text-primary text-italic'>track</span>
        </h1>
        <div className={styles.container} style={{ padding: 0 }}>
          <Input
            placeholder='What do you want to listen to?'
            onChange={typeInput}
          />
          <ul style={{ overflow: 'scroll' }}>
            {tracks?.map((track) => (
              <TrackListItemView track={track} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const providers = await getProviders();
  if (providers === null) throw new Error('Could not get spotify providers');

  return { props: { provider: providers.spotify } };
};
