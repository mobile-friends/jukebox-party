import React, { useEffect, useState } from 'react';
import { ClientSafeProvider, getProviders, useSession } from 'next-auth/react';
import { Track } from '../../lib/track';
import { GetServerSideProps } from 'next/types';
import QueueTracks from '../../components/elements/queueTracks';
import { queue } from '../../httpClient/jukebox/queue';

interface Props {
  provider: ClientSafeProvider;
}
export default function Queue({ provider }: Props) {
  let { data: session } = useSession() as any;
  const [currentQueueTracks, setCurrentQueueTracks] = useState<Track[]>([]);

  useEffect(() => {
    queue(session?.user?.accessToken)
      .then(setCurrentQueueTracks)
      .catch((e) => console.error(e));
  }, [session]);

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
