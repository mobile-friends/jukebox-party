import React, { useEffect, useState } from 'react';
import PlaybackView from '@component/playbackView';
import { Party } from '@common/types/party';
import Navbar from '@component/navbar';
import { GetServerSideProps } from 'next/types';
import { PartyDb } from '@common/partyDb';
import styles from '../../../styles/pages/party/home.module.scss';
import firebaseDb from '@common/firebaseDb';
import { PartyCode } from '@common/types/partyCode';
import useLivePlaybackState from '@hook/useLivePlaybackState';
import PartyHeader from '@component/elements/partyHeader';
import { ServersideSession } from '@common/serversideSession';
import { Guest, User } from '@common/types/user';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import PartyUserView from '@component/partyUserView';
import QueueWrapper from '@component/queueWrapper';
import Button from '@component/elements/button';
import { useRouter } from 'next/router';
import { useWindowSize } from '@hook/useWindowSize';
import LyricsWrapper from '@component/lyricsWrapper';

interface Props {
  partyName: string;
  partyCode: PartyCode;
  isHost: boolean;
}

export default function PartyRoom({ partyName, partyCode, isHost }: Props) {
  const router = useRouter();
  const playbackState = useLivePlaybackState(partyCode);
  const windowSize = useWindowSize();

  function goToQueue() {
    router.push(`/party/${partyCode}/queue`).catch(console.error);
  }

  return (
    <div>
      <div className={styles.partyPage}>
        <PartyHeader
          partyName={partyName}
          partyCode={partyCode}
          isHost={isHost}
        />
        <div className={styles.partyContent}>
          {playbackState ? (
            <div className={`${styles.playbackDesign}`}>
              <div className={`${styles.trackView}`}>
                <PlaybackView
                  playbackState={playbackState}
                  partyCode={partyCode}
                />
              </div>
              {windowSize !== null && windowSize.width > 750 ? (
                <div>
                  <div className={`${styles.queueView}`}>
                    <h2>Next is</h2>
                    <QueueWrapper partyCode={partyCode} minified={true} />
                    <div className={styles.queueInfo}>
                      <Button
                        styleType='tertiary'
                        content='see full queue'
                        onClick={goToQueue}
                      />
                    </div>
                  </div>
                  <>
                    <LyricsWrapper
                      playTime={playbackState.playTime}
                      track={playbackState.track}
                    />
                  </>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <div className='text-center smaller_box'>
              <h2 className='text-primary'>
                Are you still listening on the same output device?
              </h2>
              <span>
                Press play on the output device of your choice (laptop,
                smartphone, ...), so we know which output device we may use.
              </span>
            </div>
          )}
        </div>
      </div>
      <Navbar partyCode={partyCode} />
    </div>
  );
}

PartyRoom.auth = true;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const user = await ServersideSession.tryGetAuthUser(ctx);
  if (!user) {
    return { redirect: { destination: '/' }, props: {} as Props };
  }
  const party = await PartyDb.tryGetByCode(firebaseDb, user.partyCode);
  if (PartyDb.isError(party))
    return {
      redirect: { destination: '/party/404' },
      props: {} as Props,
    };
  return {
    props: {
      partyName: Party.nameOf(party),
      partyCode: Party.codeOf(party),
      isHost: Party.hasHostWithId(party, user.id),
    },
  };
};
