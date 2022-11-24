import { Track } from '../../lib/track';
import { Artist } from '../../lib/artist';

export interface TrackViewProps {
  track: Track;
}

export default function TrackView({ track }: TrackViewProps) {
  return (
    <div>
      <p>{Track.nameOf(track)}</p>
      {Track.artistsOf(track).map((artist) => {
        let artistName = Artist.nameOf(artist);
        return <div key={artistName}>{artistName}</div>;
      })}
    </div>
  );
}
