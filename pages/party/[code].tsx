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
import { currentlyPlaying } from '../../httpClient/spotify/player';
import { createTrack } from '../../utils/createTrack';
import { useSession } from 'next-auth/react';

type Props = {};

function PartyRoom({}: Props) {
  const router = useRouter();
  let { data: session } = useSession() as any;
  const [currentTrack, setCurrentTrack] = useState<Track>();

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

    const interval = setInterval(() => {
      getCurrentlyPlaying();
    }, 5000);

    return () => clearInterval(interval);
  }, [result]);

  const getCurrentlyPlaying = async () => {
    if (session?.user?.accessToken) {
      const result = await currentlyPlaying(session.user.accessToken);
      if (result) {
        const track = createTrack(result.item);
        setCurrentTrack(track);
      } else {
        console.log(
          'no Track is currently playing! Getting recently played Track!'
        );
        //getRecentlyPlayed();
      }
    } else {
      console.log('waiting for session');
    }
  };

  if (!PartyDb.isError(result)) {
    // TODO: Extract component
    const party = result;
    const partyIsLoaded = party !== null;
    if (partyIsLoaded) {
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
              playbackState={PlaybackState.makePlaying(Duration.Zero)}
            />
          ) : (
            <p>NO TRACK IS CURRENTLY PLAYING!</p>
          )}
        </div>
      );
    } else {
      // TODO: Extract component
      return <p>Loading party...</p>;
    }
  }
}

export default PartyRoom;
