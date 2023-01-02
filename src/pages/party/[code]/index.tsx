import React, { useEffect, useState } from 'react';
import TrackView from '@component/trackView';
import { Track } from '@common/types/track';
import { PlaybackState } from '@common/types/playbackState';
import { Party } from '@common/types/party';
import Navbar from '@component/navbar';
import QRCodeModal from '@component/qrCodeModal';
import Button from '@component/elements/button';
import { useModalVisibility } from '@hook/useModalVisibility';
import { GetServerSideProps } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { User } from '@common/types/user';
import { PartyDb } from '@common/partyDb';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import styles from '../../../styles/pages/party/home.module.scss';
import firebaseDb from '@common/firebaseDb';
import JukeHeader from '@component/elements/jukeHeader';

type Props = { party: Party };

export default function PartyRoom({ party }: Props) {
  const { isModalVisible, handleModalVisibility } = useModalVisibility();
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
    const result = await JukeClient.getCurrentTrack(Party.codeOf(party));
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
    const result = await JukeClient.getPlayback(Party.codeOf(party));
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

  if (party === null) return <div>Loading party</div>;

  if (PartyDb.isError(party)) return <div>An error occurred</div>;

  // TODO: Extract component

  const guestList =
    Party.guestsOf(party)
      .map((guest) => guest.name)
      .join(', ') || 'No guests have joined the party yet';
  return (
    <div className={styles.container}>
      <JukeHeader first={'jukebox'} second={'party'} />
      <p>Party Code: {Party.codeOf(party)}</p>
      <p>Party Name: {Party.nameOf(party)}</p>
      <p>Party Host: {User.nameOf(Party.hostOf(party))}</p>
      <p>Party Guests: {guestList}</p>
      {currentTrack && playbackState ? (
        <TrackView
          track={currentTrack}
          playbackState={playbackState}
          partyCode={Party.codeOf(party)}
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
        onClick={() => {
          handleModalVisibility();
        }}
      ></Button>
      {isModalVisible && (
        <QRCodeModal
          onModalClosed={() => {
            handleModalVisibility();
          }}
          partyCode={Party.codeOf(party)}
        />
      )}
      <Navbar partyCode={Party.codeOf(party)} />
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
  return { props: { party } };
};
