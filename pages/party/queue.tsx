import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Track } from '../../lib/track';
import QueueTracks from '../../components/elements/queueTracks';
import { queue } from '../../httpClient/jukebox/queue';
import { useRouter } from 'next/router';
import Button from '../../components/elements/button';
import Navbar from '../../components/elements/navbar';
import QueueHeader from '../../components/elements/queueHeader';

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

  const trackNames = currentQueueTracks.map((tracks: Track) => (
    <QueueTracks track={tracks} />
  ));

  const partyCode = sessionStorage.getItem('partyCode');
  const partyName = sessionStorage.getItem('partyName');

  return (
    <div>
      <QueueHeader partyName={partyName} partyCode={partyCode}/>
      <div>{trackNames}</div>
      <Navbar />
    </div>
  );
}
