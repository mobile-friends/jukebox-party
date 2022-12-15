import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useFetchParty from '../../hooks/parties/useFetchParty';
import TrackView from '../../components/elements/trackView';
import { Track } from '../../lib/track';
import { Duration } from '../../lib/duration';
import { PlaybackState } from '../../lib/playbackState';
import { tryQueryParam } from '../../lib/query';
import { PartyCode } from '../../lib/partyCode';
import { PartyDb } from '../../lib/partyDb';
import { Party } from '../../lib/party';
import {
  currentlyPlaying,
  playbackState,
  recentlyPlayed,
} from '../../httpClient/spotify/player';
import { createTrack } from '../../utils/createTrack';
import { useSession } from 'next-auth/react';
import { recommendations } from '../../httpClient/spotify/browse';
import Navbar from '../../components/elements/navbar';
import { useModalVisibility } from '../../hooks/modals/useModalVisibility';
import QRCodeModal from '../../components/elements/qrCodeModal';
import Button from '../../components/elements/button';

type Props = {};

function PartyRoom({}: Props) {
  const router = useRouter();
  let { data: session } = useSession() as any;
  const { isModalVisible, handleModalVisibility } = useModalVisibility();
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const [playbackProgress, setPlaybackProgress] = useState<Duration>(
    Duration.Zero
  );
  const [playbackIsPlaying, setPlaybackIsPlaying] = useState<boolean>(false);

  const partyCodeParam = tryQueryParam(router.query, 'code');
  if (partyCodeParam === null) {
    // TODO: Handle missing query param error
    throw new Error('Missing query param');
  }

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    // TODO: Handle invalid party-code
    throw new Error('Invalid party code');
  }

  const result = useFetchParty(partyCode);

  useEffect(() => {
    if (PartyDb.isError(result)) {
      switch (result.kind) {
        case PartyDb.ErrorType.PartyNotFound:
          router.push('/party/404').catch(console.log);
          break;
        default:
          // TODO: Handle other errors
          break;
      }
    }

    getCurrentlyPlaying();
    const interval = setInterval(getCurrentlyPlaying, 5000);

    getPlaybackState();
    const intervalPlayback = setInterval(getPlaybackState, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(intervalPlayback);
    };
  }, [result]);

  const getCurrentlyPlaying = async () => {
    try {
      const result = await currentlyPlaying(session?.user?.accessToken);
      if (result) {
        setCurrentTrack(createTrack(result.item));
      } else {
        console.log('no Track is currently playing! Getting Recommendation!');
        getRecentlyPlayedRecommendation();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRecentlyPlayedRecommendation = async () => {
    try {
      const results = await recentlyPlayed(session?.user?.accessToken);
      const recommendation = await recommendations(
        results.items.map((item: any) => item.track.id).join(','),
        session?.user?.accessToken
      );
      console.log('Recommendation: ', recommendation.tracks[0]);
      //TODO: add to Queue
    } catch (error) {
      console.error(error);
    }
  };

  const getPlaybackState = async () => {
    try {
      const result = await playbackState(session?.user?.accessToken);
      if (!result) return;
      const progressDuration: Duration = Duration.makeFromMiliSeconds(
        result.progress_ms
      );
      setPlaybackIsPlaying(result.is_playing);
      setPlaybackProgress(progressDuration);
    } catch (error) {
      console.error(error);
    }
  };

  if (!PartyDb.isError(result)) {
    // TODO: Extract component
    const party = result;
    const partyIsLoaded = party !== null;
    if (partyIsLoaded) {
      sessionStorage.setItem('partyName', party.name);
      const guestList =
        Party.guestsOf(party)
          .map((guest) => guest.name)
          .join(', ') || 'No guests have joined the party yet';
      return (
        <div>
          <h1>Party Room</h1>
          <p>Party Code: {party.code}</p>
          <p>Party Name: {party.name}</p>
          <p>Party Host: {party.host.name}</p>
          <p>Party Guests: {guestList}</p>
          {currentTrack ? (
            <TrackView
              track={currentTrack}
              playbackState={PlaybackState.makePlaying(
                playbackProgress,
                playbackIsPlaying
              )}
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
              code={party.code}
            />
          )}
          <Navbar />
        </div>
      );
    } else {
      // TODO: Extract component
      return <p>Loading party...</p>;
    }
  }
}

export default PartyRoom;
