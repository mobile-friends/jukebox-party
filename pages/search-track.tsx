import { getProviders, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Input from '../components/elements/input';
import TrackListItemView from '../components/elements/trackListItemView';
import { search } from '../httpClient/jukebox/search';
import { Artist } from '../lib/artist';
import { Duration } from '../lib/duration';
import { Track } from '../lib/track';
import styles from '../styles/pages/main.module.scss';

export default function SearchTrack({ provider }) {
  const [queryString, setQueryString] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const router = useRouter();
  let { data: session } = useSession() as any;

  useEffect(() => {
    console.log('session', session);
  }, [session, null]);

  const typeInput = async (e: any) => {
    setQueryString(e.target.value);
    if (queryString?.length <= 3) return;
    try {
      const results = await search(
        queryString,
        'track',
        session.user.accessToken
      );
      console.log('results', results);
      let tracks = [];
      results.tracks.items.forEach((track: any) => {
        const trackElement = Track.make(
          track.name,
          Duration.make(0, track.duration_ms / 1000),
          [track.artists.map((artist: any) => Artist.make(artist.name))],
          track.album.images[0].url
        );
        tracks = [...tracks, trackElement];
      });
      console.log('tracks', tracks);

      setResults(tracks);
    } catch (e) {
      console.log(e);
      setResults(null);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          search.<span className='text-primary text-italic'>track</span>
        </h1>
        <div className={styles.container}>
          <Input
            placeholder='What do you want to listen to?'
            onChange={typeInput}
          />
        </div>
        <ul>
          {results?.map((track: any) => (
            <TrackListItemView track={track} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return { props: { provider: providers?.spotify } };
}
