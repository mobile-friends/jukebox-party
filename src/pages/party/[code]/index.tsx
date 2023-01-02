import React from 'react';
import PlaybackView from '@component/playbackView';
import { Party } from '@common/types/party';
import Navbar from '@component/navbar';
import { GetServerSideProps } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { PartyDb } from '@common/partyDb';
import styles from '../../../styles/pages/party/home.module.scss';
import firebaseDb from '@common/firebaseDb';
import { PartyCode } from '@common/types/partyCode';
import useLivePlaybackState from '@hook/useLivePlaybackState';
import PartyHeader from '@component/elements/partyHeader';

interface Props {
  partyName: string;
  partyCode: PartyCode;
}

export default function PartyRoom({ partyName, partyCode }: Props) {
  const playbackState = useLivePlaybackState(partyCode);

  return (
    <div>
      <div className={styles.partyPage}>
        <PartyHeader partyName={partyName} partyCode={partyCode} />

        <div className={styles.partyContent}>
          {playbackState ? (
            <PlaybackView playbackState={playbackState} partyCode={partyCode} />
          ) : (
            <div className='text-center'>
              <p>NO TRACK IS CURRENTLY PLAYING!</p>
              <p>Please press on the play button in Spotify!</p>
            </div>
          )}
        </div>
      </div>

      <Navbar partyCode={partyCode} />
    </div>
  );
}

PartyRoom.auth = true;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return { redirect: { destination: '/' }, props: {} as Props };
  }
  const party = await PartyDb.tryGetByCode(firebaseDb, session.user.partyCode);
  if (PartyDb.isError(party))
    return {
      redirect: { destination: '/party/404' },
      props: {} as Props,
    };
  return {
    props: {
      partyName: Party.nameOf(party),
      partyCode: Party.codeOf(party),
    },
  };
};
