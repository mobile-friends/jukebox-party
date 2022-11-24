import TrackView from '../components/elements/trackView';
import { Track } from '../lib/track';
import { Artist } from '../lib/artist';

// TODO: Get this from the db or something
const testTrack = Track.make('Test-track', [
  Artist.make('Mr. guitar'),
  Artist.make('Mrs. music'),
]);

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <TrackView track={testTrack} />
    </div>
  );
}
