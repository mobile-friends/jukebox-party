import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Track } from '../../lib/track';
import QueueTracks from '../../components/elements/queueTracks';
import { queue } from '../../httpClient/jukebox/queue';
import { useRouter } from 'next/router';

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

  return (
    <div>
      {/* TODO get partyname localStorage? state? */}
      <div>
        <h1>insert Partyname</h1>
      </div>
      <div>
        <h2>Code: {partyCode}</h2>
      </div>
      <div>{trackNames}</div>
    </div>
  );
}
