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
import { Guest, User } from '@common/types/user';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import PartyUserView from '@component/partyUserView';
import Queue from './queue';

interface Props {
  partyName: string;
  partyCode: PartyCode;
  isHost: boolean;
}

export default function PartyRoom({ partyName, partyCode, isHost }: Props) {
  const playbackState = useLivePlaybackState(partyCode);

  async function removeGuest(guest: Guest) {
    const result = await JukeClient.removeGuest(partyCode, {
      guestId: User.idOf(guest),
    });
    switch (result.code) {
      case StatusCodes.BAD_REQUEST:
        // TODO: Handle error
        break;
      case StatusCodes.NOT_FOUND:
        // TODO: Handle error
        break;
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle error
        break;
      case StatusCodes.NO_CONTENT: // Everything worked out
        return;
      default:
        return assertNeverReached(result);
    }
  }

  return (
    <div>
      <div className={styles.partyPage}>
        <PartyHeader partyName={partyName} partyCode={partyCode} />
        <PartyUserView
          partyCode={partyCode}
          isHost={isHost}
          onGuestRemove={removeGuest}
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
              <div className={`${styles.queueView}`}>
                <Queue partyCode={partyCode} />
              </div>
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
