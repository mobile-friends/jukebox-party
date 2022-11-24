import { makeTrack, nameOf } from '../lib/Track';

// TODO: Get this from the db or something
const testTrack = makeTrack('Test-track');

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>{nameOf(testTrack)}</p>
    </div>
  );
}
