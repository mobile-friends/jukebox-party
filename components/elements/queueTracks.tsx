import { Track } from '../../lib/track';
import { Artist } from '../../lib/artist';
export interface queueTracks {
  track: Track;
}

export default function QueueTracks({ track }: queueTracks) {
  // TODO: fix track type / album art with array
  const albumArt = <img src={track.album.images[2].url} alt='Album art' />;

  const nameView = <p>{Track.nameOf(track)}</p>;

  const artistViews = Track.artistsOf(track).map((artist) => {
    let artistName = Artist.nameOf(artist);
    return <div key={artistName}>{artistName}</div>;
  });

  return (
    <div>
      {albumArt}
      {nameView}
      {artistViews}
    </div>
  );
}
