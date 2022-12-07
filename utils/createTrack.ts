import { Artist } from '../lib/artist';
import { Duration } from '../lib/duration';
import { Track } from '../lib/track';

//creates a Track of the Result Item from the API
const createTrack = (result: any) => {
  const trackName = result.name;
  const trackDuration = result.duration_ms;
  const artists = [];
  result.artists.forEach((element: { name: string }) => {
    artists.push(Artist.make(element.name));
  });
  const albumArtUrl = result.album.images[1].url;
  const track = Track.make(
    trackName,
    Duration.makeFromMiliSeconds(trackDuration),
    artists,
    albumArtUrl
  );

  return track;
};

export { createTrack };
