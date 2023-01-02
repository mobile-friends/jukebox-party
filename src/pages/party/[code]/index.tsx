import React, { useEffect, useState } from 'react';
import TrackView from '@component/trackView';
import { Track } from '@common/types/track';
import { PlaybackState } from '@common/types/playbackState';
import { Party } from '@common/types/party';
import Navbar from '@component/navbar';
import QRCodeModal from '@component/qrCodeModal';
import Button from '@component/elements/button';
import { GetServerSideProps } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { PartyDb } from '@common/partyDb';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import styles from '../../../styles/pages/party/home.module.scss';
import firebaseDb from '@common/firebaseDb';
import JukeHeader from '@component/elements/jukeHeader';
import { PartyCode } from '@common/types/partyCode';
import PartyUserView from '@component/partyUserView';
import useToggle from '@hook/useToggle';

interface Props {
  partyName: string;
  partyCode: PartyCode;
}

export default function PartyRoom({ partyName, partyCode }: Props) {
  const [isModalVisible, toggleModalVisibility] = useToggle();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null
  );

  async function onTrackReceived(track: Track | null) {
    if (track) {
      setCurrentTrack(track);
    } else {
      await getRecentlyPlayedRecommendation();
    }
  }

  const getCurrentlyPlaying = async () => {
    const result = await JukeClient.getCurrentTrack(partyCode);
    switch (result.code) {
      case StatusCodes.OK:
        return await onTrackReceived(result.content.track);
      case StatusCodes.UNAUTHORIZED:
      case StatusCodes.BAD_REQUEST:
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle errors
        break;
      default:
        return assertNeverReached(result);
    }
  };

  const getRecentlyPlayedRecommendation = async () => {
    try {
      // const recentTrackIds = await recentlyPlayed();
      // const recommendedTracks = await recommendations(recentTrackIds);
      //TODO: This should probably happen in the backend
    } catch (error) {
      console.error(error);
    }
  };

  const getPlaybackState = async () => {
    const result = await JukeClient.getPlayback(partyCode);
    switch (result.code) {
      case StatusCodes.OK:
        setPlaybackState(result.content.playbackState);
        return;
      case StatusCodes.UNAUTHORIZED:
        // TODO: Handle error
        break;
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle error
        break;
      default:
        return assertNeverReached(result);
    }
  };

  useEffect(() => {
    if (currentTrack === null) getCurrentlyPlaying().catch(console.error);
    if (playbackState === null) getPlaybackState().catch(console.error);
    const interval = setInterval(getCurrentlyPlaying, 5000);
    const intervalPlayback = setInterval(getPlaybackState, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(intervalPlayback);
    };
  });

  // TODO: Extract component

  return (
    <div className={styles.container}>
      <JukeHeader first={'jukebox'} second={'party'} />
      <p>Party Code: {partyCode}</p>
      <p>Party Name: {partyName}</p>
      <PartyUserView partyCode={partyCode} />
      {currentTrack && playbackState ? (
        <TrackView
          track={currentTrack}
          playbackState={playbackState}
          partyCode={partyCode}
        />
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
