import React, { useEffect, useState } from 'react';
import Navbar from '@component/navbar';
import { Track } from '@common/types/track';
import { GetServerSideProps } from 'next/types';
import { PartyCode } from '@common/types/partyCode';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { JukeClient } from '@common/jukeClient';
import { GetQueueResult } from '@endpoint/getQueue';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import TrackItem from '@component/elements/trackItem';
import JukeHeader from '@component/elements/jukeHeader';
import { ServersideSession } from '@common/serversideSession';
import { signOut } from 'next-auth/react';

interface Props {
  partyCode: PartyCode;
}

export default function Queue({ partyCode }: Props) {
  const [currentQueueTracks, setCurrentQueueTracks] = useState<Track[]>([]);

  function onQueueResult(result: GetQueueResult) {
    switch (result.code) {
      case StatusCodes.OK:
        return setCurrentQueueTracks(result.content.tracks);
      case StatusCodes.UNAUTHORIZED:
        // TODO: Redirect to better unauthorized page [JUKE-143]
        return signOut({ callbackUrl: '/' }).catch(console.error);
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle errors [JUKE-142]
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

  return (
    <div>
      <JukeHeader
        first={'party'}
        second={'tracks'}
        pageTitle={'Queue | jukebox.party'}
      />
      <div>{tracks}</div>
      <Navbar partyCode={partyCode} />
    </div>
  );
}

Queue.auth = true;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const partyCode = await ServersideSession.tryGetPartyCode(ctx);
  if (!partyCode) {
    return { redirect: { destination: '/' }, props: {} as Props };
  }
  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);

  if (!(party && !PartyDb.isError(party))) {
    return {
      redirect: { destination: '/' }, // TODO: Add better non-auth page [JUKE-143]
      props: {} as Props,
    };
  }
  return {
    props: {
      partyCode: Party.codeOf(party),
    },
  };
};
