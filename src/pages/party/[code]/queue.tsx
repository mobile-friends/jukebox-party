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
import { PagePath } from '@common/pagePath';

interface Props {
  partyCode: PartyCode;
}

export default function PartyQueuePage({ partyCode }: Props) {
  return (
    <div className='queueContainer'>
      <div className='queueHeader'>
        <JukeHeader
          first={'party'}
          second={'tracks'}
          pageTitle={'Queue | jukebox.party'}
        />
      </div>
      <QueueWrapper partyCode={partyCode} minified={false} />
      <Navbar partyCode={partyCode} />
    </div>
  );
}

PartyQueuePage.auth = true;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const partyCode = await ServersideSession.tryGetPartyCode(ctx);
  if (!partyCode) {
    return { redirect: { destination: PagePath.Home }, props: {} as Props };
  }
  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);

  if (!(party && !PartyDb.isError(party))) {
    return {
      redirect: { destination: PagePath.Home }, // TODO: Add better non-auth page [JUKE-143]
      props: {} as Props,
    };
  }
  return {
    props: {
      partyCode: Party.codeOf(party),
    },
  };
};
