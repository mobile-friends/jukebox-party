import { Artist } from '../lib/artist';
import { Duration } from '../lib/duration';
import { Track } from '../lib/track';

//creates a Track of the Result Item from the API
const createTrack = (result: any) => {
  const trackName: string = result.name;
  const trackDuration: Duration = Duration.makeFromMiliSeconds(
    result.duration_ms
  );
  const artists: Artist[] = [];
  result.artists.forEach((element: { name: string }) => {
    artists.push(Artist.make(element.name));
  });
  const albumArtUrl: string = result.album.images[1].url;
  const track: Track = Track.make(
    trackName,
    trackDuration,
    artists,
    albumArtUrl
  );

  return track;
};

export { createTrack };
