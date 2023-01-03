import React from 'react';
import PlaybackView from '@component/playbackView';
import { Party } from '@common/types/party';
import Navbar from '@component/navbar';
import QRCodeModal from '@component/qrCodeModal';
import Button from '@component/elements/button';
import { GetServerSideProps } from 'next/types';
import { PartyDb } from '@common/partyDb';
import styles from '../../../styles/pages/party/home.module.scss';
import firebaseDb from '@common/firebaseDb';
import JukeHeader from '@component/elements/jukeHeader';
import { PartyCode } from '@common/types/partyCode';
import PartyUserView from '@component/partyUserView';
import useToggle from '@hook/useToggle';
import useLivePlaybackState from '@hook/useLivePlaybackState';
import { ServersideSession } from '@common/serversideSession';

interface Props {
  partyName: string;
  partyCode: PartyCode;
  isHost: boolean;
}

export default function PartyRoom({ partyName, partyCode, isHost }: Props) {
  const [isModalVisible, toggleModalVisibility] = useToggle();
  const playbackState = useLivePlaybackState(partyCode);

  return (
    <div className={styles.container}>
      <JukeHeader first={'jukebox'} second={'party'} />
      <p>Party Code: {partyCode}</p>
      <p>Party Name: {partyName}</p>
      <PartyUserView partyCode={partyCode} />
      {playbackState ? (
        <PlaybackView playbackState={playbackState} partyCode={partyCode} />
      ) : (
        <div>
          <p>NO TRACK IS CURRENTLY PLAYING!</p>
          <p>Please press on the play button in Spotify!</p>
        </div>
      )}

      <Button
        content='Show QR Code'
        styleType='primary'
        onClick={toggleModalVisibility}
      ></Button>
      {isModalVisible && (
        <QRCodeModal onClosed={toggleModalVisibility} partyCode={partyCode} />
      )}
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
