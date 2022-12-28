import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import TrackView from '@component/elements/trackView';
import { Track } from '@common/types/track';
import { Duration } from '@common/types/duration';
import { PlaybackState } from '@common/types/playbackState';
import { Party } from '@common/types/party';
import Navbar from '@component/elements/navbar';
import QRCodeModal from '@component/elements/qrCodeModal';
import Button from '@component/elements/button';
import { useModalVisibility } from '@hook/modals/useModalVisibility';
import { GetServerSideProps } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { User } from '@common/types/user';
import useFetchParty from '@hook/parties/useFetchParty';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import { JukeClient } from '@common/jukeClient';

type Props = { partyCode: PartyCode };

export default function PartyRoom({ partyCode }: Props) {
  const router = useRouter();
  const { isModalVisible, handleModalVisibility } = useModalVisibility();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<Duration>(
    Duration.Zero
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const party = useFetchParty(partyCode);

  const getCurrentlyPlaying = async () => {
    try {
      const track = await JukeClient.getCurrentTrack(partyCode);
      if (track) {
        setCurrentTrack(track);
      } else {
        await getRecentlyPlayedRecommendation();
      }
    } catch (error) {
      console.error(error);
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
    const playbackState = await JukeClient.getPlayback(partyCode);
    setIsPlaying(PlaybackState.isPlaying(playbackState));
    setPlaybackProgress(PlaybackState.playTimeOf(playbackState));
  };

  useEffect(() => {
    getCurrentlyPlaying().catch(console.error);
    getPlaybackState().catch(console.error);
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
    <div>
      <h1>Party Room</h1>
      <p>Party Code: {Party.codeOf(party)}</p>
      <p>Party Name: {Party.nameOf(party)}</p>
      <p>Party Host: {User.nameOf(Party.hostOf(party))}</p>
      <p>Party Guests: {guestList}</p>
      {currentTrack ? (
        <TrackView
          track={currentTrack}
          playbackState={PlaybackState.make(playbackProgress, isPlaying)}
          partyCode={partyCode}
        />
      ) : (
        <div>
          <p>NO TRACK IS CURRENTLY PLAYING!</p>
          <p>Please press on the play button in Spotify!</p>
        </div>
      )}

      <Button
        text='Show QR Code'
        type='primary'
        onClick={() => {
          handleModalVisibility();
        }}
      ></Button>
      {isModalVisible && (
        <QRCodeModal
          closeModal={() => {
            handleModalVisibility();
          }}
          code={Party.codeOf(party)}
        />
      )}
      <Navbar partyCode={Party.codeOf(party)} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return { redirect: { destination: '/' }, props: {} as Props };
  }
  return { props: { partyCode: session.user.partyCode } };
};
