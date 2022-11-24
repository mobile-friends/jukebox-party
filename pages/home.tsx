import { makeTrack } from '../lib/Track';
import TrackView from '../components/elements/trackView';

// TODO: Get this from the db or something
const testTrack = makeTrack('Test-track');

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <TrackView track={testTrack} />
    </div>
  );
}
