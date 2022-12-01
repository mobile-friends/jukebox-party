import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Party } from '../../lib/party';
import useFetchParty from '../../hooks/parties/useFetchParty';
import TrackView from '../../components/elements/trackView';
import { Track } from '../../lib/track';
import { Duration } from '../../lib/duration';
import { Artist } from '../../lib/artist';
import { PlaybackState } from '../../lib/playbackState';

type Props = {};

interface QueryParams {
  code?: string;
}

const testTrack = Track.make(
  'Test-track',
  Duration.make(2, 30),
  [Artist.make('Mr. guitar'), Artist.make('Mrs. music')],
  'https://media.tenor.com/kwoZiw3sdlwAAAAM/spongebob-cartoon.gif'
);

function PartyRoom({}: Props) {
  const router = useRouter();
  const { code }: QueryParams = router.query;
  const party: Party | null | undefined = useFetchParty(code);

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
