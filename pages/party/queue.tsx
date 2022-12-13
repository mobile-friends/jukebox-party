import React, { useEffect, useState } from 'react';
import { ClientSafeProvider, getProviders, useSession } from 'next-auth/react';
import { currentQueue } from '../../httpClient/spotify/player';
import { Track } from '../../lib/track';
import { GetServerSideProps } from 'next/types';
import QueueTracks from '../../components/elements/queueTracks';

interface Props {
  provider: ClientSafeProvider;
}
export default function Queue({ provider }: Props) {
  let { data: session } = useSession() as any;
  const [currentQueueTracks, setCurrentQueueTracks] = useState<Track[]>([]);

  useEffect(() => {
    getCurrentQueue();
  }, [session?.user?.accessToken]);
  // }, [setCurrentQueueTracks]);

  const getCurrentQueue = async () => {
    try {
      const result = await currentQueue(session?.user?.accessToken);
      if (result) {
        setCurrentQueueTracks(result);
        // console.log(currentQueueTracks);
      }
    } catch (error) {
      setCurrentQueueTracks([]);
      console.error(error);
    }
  };

  const trackNames = currentQueueTracks.map((tracks: Track) => (
    <QueueTracks track={tracks} />
  ));

  return (
    <div>
      Queue Template
      <div>{trackNames}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const providers = await getProviders();
  if (providers === null) throw new Error('Could not get spotify providers');

  return { props: { provider: providers.spotify } };
};
