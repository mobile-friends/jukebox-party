import TrackView from '../components/elements/trackView';
import { Track } from '../lib/track';
import { Artist } from '../lib/artist';
import { Duration } from '../lib/duration';
import { PlaybackState } from '../lib/playbackState';
import { currentlyPlaying } from '../httpClient/spotify/player';

// TODO: Get this from the db or something
const testTrack = Track.make(
  'Test-track',
  Duration.make(2, 30),
  [Artist.make('Mr. guitar'), Artist.make('Mrs. music')],
  'https://media.tenor.com/kwoZiw3sdlwAAAAM/spongebob-cartoon.gif'
);

export default function Home({ context }) {
  return (
    <div>
      <h1>Home</h1>
      <TrackView
        track={testTrack}
        playbackState={PlaybackState.makePlaying(Duration.Zero)}
      />
    </div>
  );
}
