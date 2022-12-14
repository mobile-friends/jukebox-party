import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Track } from '../../lib/track';
import QueueTracks from '../../components/elements/queueTracks';
import { queue } from '../../httpClient/jukebox/queue';
import { useRouter } from 'next/router';
import Button from '../../components/elements/button';

interface Props {}
export default function Queue({}: Props) {
  const router = useRouter();
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

  const partyCode = router.query.code;
  const partyName = router.query.name;

  return (
    <div>
      <div>
        <Button
          text='go back'
          type='secondary'
          onClick={() => router.back()}
        />
        <h1>{partyName}</h1>
        <h2>Code: {partyCode}</h2>
      </div>
      <div>{trackNames}</div>
    </div>
  );
}
