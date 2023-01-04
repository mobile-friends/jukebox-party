import React, { useEffect, useState } from 'react';
import { Track } from '@common/types/track';
import { PartyCode } from '@common/types/partyCode';
import { JukeClient } from '@common/jukeClient';
import { GetQueueResult } from '@endpoint/getQueue';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import TrackItem from '@component/elements/trackItem';
import { signOut } from 'next-auth/react';

interface Props {
  partyCode: PartyCode;
}

export default function QueueWrapper({ partyCode }: Props) {
  const [currentQueueTracks, setCurrentQueueTracks] = useState<Track[]>([]);

  function onQueueResult(result: GetQueueResult) {
    switch (result.code) {
      case StatusCodes.OK:
        return setCurrentQueueTracks(result.content.tracks);
      case StatusCodes.UNAUTHORIZED:
        // TODO: Redirect to better unauthorized page
        return signOut({ callbackUrl: '/' }).catch(console.error);
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle errors
        break;
      default:
        return assertNeverReached(result);
    }
  }

  useEffect(() => {
    JukeClient.getQueue(partyCode).then(onQueueResult).catch(console.error);
  });

  const tracks = currentQueueTracks.map((track: Track) => (
    <TrackItem key={Track.nameOf(track)} track={track} />
  ));

  return <div>{tracks}</div>;
}
