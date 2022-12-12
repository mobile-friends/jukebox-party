import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { tryQueryParam } from '../../lib/query';
import { useSession } from 'next-auth/react';
//import { currentQueue } from '../../httpClient/spotify/player';

type Props = {};

function Queue({}: Props) {
  const router = useRouter();
  let { data: session } = useSession() as any;
  //   const [currentTrack, setCurrentTrack] = useState<Track>();



  //   const partyCodeParam = tryQueryParam(router.query, 'code');
  //   if (partyCodeParam === null) {
  //     // TODO: Handle missing query param error
  //     throw new Error('Missing query param');
  //   }

  return <div>Queue Template</div>;
}

export default Queue;
