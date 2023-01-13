import styles from '@style/pages/party/closed.module.scss';
import React from 'react';
import JukeHeader from '@component/elements/jukeHeader';
import { GetServerSideProps } from 'next/types';
import { PartyCode } from '@common/types/partyCode';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { ServersideSession } from '@common/serversideSession';
import HistoryWrappr from '@component/historyWrapper';
import Button from '@component/elements/button';
import { PagePath } from '@common/pagePath';

interface Props {
  partyCode: PartyCode;
}

export default function Closed({ partyCode }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <JukeHeader
          first={'party'}
          second={'end'}
          pageTitle={'End | jukebox.party'}
        />
      </div>
      <div className={styles.textContainer}>
        <h2>You have ended the party.</h2>
        <p>
          Thank you for using jukebox.party! <br /> We are looking forward to
          the next time you start a party again.{' '}
        </p>
        <p>
          Your jukebox.<span className='text-primary text-italic'>party </span>
          team
        </p>
      </div>

      <h3>Your party.history:</h3>
      <div className={styles.historyContainer}>
        <HistoryWrappr
          partyCode={partyCode}
          minified={false}
          onEndScreen={true}
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button
          styleType='primary block'
          content={'Back to Home'}
          onClick={() => location.assign(PagePath.Home)}
        />
      </div>
    </div>
  );
}

Closed.auth = true;

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
