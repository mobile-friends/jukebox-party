import React, { useEffect, useState } from 'react';
import QueueTracks from '@component/elements/queueTracks';
import { useRouter } from 'next/router';
import Navbar from '@component/elements/navbar';
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

interface Props {
  partyCode: PartyCode;
  partyName: string;
}

export default function Queue({ partyCode, partyName }: Props) {
  const router = useRouter();
  const [currentQueueTracks, setCurrentQueueTracks] = useState<Track[]>([]);

  useEffect(() => {
    JukeClient.getQueue(partyCode)
      .then(setCurrentQueueTracks)
      .catch(console.error);
  });

  const trackNames = currentQueueTracks.map((track: Track) => (
    <QueueTracks track={track} />
  ));

  return (
    <div>
      <QueueHeader partyName={partyName} partyCode={partyCode} />
      <div>{trackNames}</div>
      <Navbar partyCode={partyCode} />
    </div>
  );
}

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
