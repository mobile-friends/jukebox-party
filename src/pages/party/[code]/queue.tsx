import React from 'react';
import Navbar from '@component/navbar';
import JukeHeader from '@component/elements/jukeHeader';
import QueueWrapper from '@component/queueWrapper';
import { GetServerSideProps } from 'next/types';
import { PartyCode } from '@common/types/partyCode';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { ServersideSession } from '@common/serversideSession';

interface Props {
  partyCode: PartyCode;
}

export default function Queue({ partyCode }: Props) {
  return (
    <div>
      <JukeHeader
        first={'party'}
        second={'tracks'}
        pageTitle={'Queue | jukebox.party'}
      />
        <QueueWrapper partyCode={partyCode} minified={false} />
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
