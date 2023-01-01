import React, { useEffect, useState } from 'react';
import Navbar from '@component/navbar';
import QueueHeader from '@component/elements/queueHeader';
import { Track } from '@common/types/track';
import { GetServerSideProps } from 'next/types';
import { PartyCode } from '@common/types/partyCode';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { JukeClient } from '@common/jukeClient';
import { GetQueueResult } from '@endpoint/getQueue';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import TrackItem from '@component/elements/trackItem';

interface Props {
  partyCode: PartyCode;
  partyName: string;
}

export default function Queue({ partyCode, partyName }: Props) {
  const [currentQueueTracks, setCurrentQueueTracks] = useState<Track[]>([]);

  function onQueueResult(result: GetQueueResult) {
    switch (result.code) {
      case StatusCodes.OK:
        return setCurrentQueueTracks(result.content.tracks);
      case StatusCodes.UNAUTHORIZED:
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

  return (
    <div>
      <QueueHeader partyName={partyName} partyCode={partyCode} />
      <div>{tracks}</div>
      <Navbar partyCode={partyCode} />
    </div>
  );
}

Queue.auth = true;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = session?.user ?? null;
  const party = user
    ? await PartyDb.tryGetByCode(firebaseDb, user.partyCode)
    : null;

  if (!(party && !PartyDb.isError(party))) {
    return {
      redirect: { destination: '/' }, // TODO: Add better non-auth page
      props: {} as Props,
    };
  }
  return {
    props: {
      partyCode: Party.codeOf(party),
      partyName: Party.nameOf(party),
    },
  };
};
