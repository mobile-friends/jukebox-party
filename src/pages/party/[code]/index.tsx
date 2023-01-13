import React from 'react';
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

export default function PartyHomePage({ partyName, partyCode, isHost }: Props) {
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
                <div style={{ display: 'grid', padding: '0 2rem' }}>
                  <div className={`${styles.queueView}`}>
                    <h2>Next up:</h2>
                    <QueueWrapper partyCode={partyCode} minified={true} />
                    <div className={styles.queueInfo}>
                      <Button
                        styleType='tertiary'
                        content='SEE FULL QUEUE'
                        onClick={goToQueue}
                      />
                    </div>
                  </div>
                  <>
                    <LyricsWrapper
                      playTime={playbackState.playTime}
                      track={playbackState.track}
                      showInfo={false}
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

PartyHomePage.auth = true;

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
