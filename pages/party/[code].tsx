import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useFetchParty from '../../hooks/parties/useFetchParty';
import TrackView from '../../components/elements/trackView';
import { Track } from '../../lib/track';
import { Duration } from '../../lib/duration';
import { Artist } from '../../lib/artist';
import { PlaybackState } from '../../lib/playbackState';
import { tryQueryParam } from '../../lib/query';
import { PartyCode } from '../../lib/partyCode';

type Props = {};

const testTrack = Track.make(
  'Test-track',
  Duration.make(2, 30),
  [Artist.make('Mr. guitar'), Artist.make('Mrs. music')],
  'https://media.tenor.com/kwoZiw3sdlwAAAAM/spongebob-cartoon.gif'
);

function PartyRoom({}: Props) {
  const router = useRouter();

  const partyCodeParam = tryQueryParam(router.query, "code")
  if (partyCodeParam === null){
    // TODO: Handle missing query param error
    throw new Error("Missing query param")
  }

  const partyCode = PartyCode.tryMake(partyCodeParam)
  if (partyCode === null){
    // TODO: Handle invalid party-code
    throw new Error("Invalid party code")
  }

  const party = useFetchParty(partyCode)

  useEffect(() => {
    if (party === null) {
      router.push('/party/404').catch(console.log);
    }
  }, [party]);

  return party ? (
    <div>
      <h1>Party Room</h1>
      <p>Party Code: {party?.code}</p>
      <p>Party Name: {party?.name}</p>
      <p>Party Host: {party?.host.name}</p>
      <p>
        Party Guests:{' '}
        {party?.guests.map((guest) => guest.name).join(', ') ||
          'No guests have joined the party yet'}
      </p>
      <TrackView
        track={testTrack}
        playbackState={PlaybackState.makePlaying(Duration.Zero)}
      />
    </div>
  ) : null;
}

export default PartyRoom;
