import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import QueueTracks from '../../components/elements/queueTracks';
import { queue } from '@httpClient/jukebox/queue';
import { useRouter } from 'next/router';
import Navbar from '../../components/elements/navbar';
import QueueHeader from '../../components/elements/queueHeader';
import { Track } from '@common/types/track';

interface Props {}

export default function Queue({}: Props) {
  const router = useRouter();
  let { data: session } = useSession() as any;
  const [currentQueueTracks, setCurrentQueueTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (session.user.accessToken) {
      queue(session?.user?.accessToken)
        .then(setCurrentQueueTracks)
        .catch((e) => console.error(e));
    }
  }, [session]);

  const trackNames = currentQueueTracks.map((track: Track) => (
    <QueueTracks track={track} />
  ));

  const partyCode = sessionStorage.getItem('partyCode');
  const partyName = sessionStorage.getItem('partyName');

  return (
    <div>
      <QueueHeader partyName={partyName} partyCode={partyCode} />
      <div>{trackNames}</div>
      <Navbar />
    </div>
  );
}
