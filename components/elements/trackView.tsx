import { Track } from '../../lib/track';
import { Artist } from '../../lib/artist';
import { Duration } from '../../lib/duration';

export interface TrackViewProps {
  track: Track;
}

export default function TrackView({ track }: TrackViewProps) {
  const nameView = <p>{Track.nameOf(track)}</p>;

  const artistViews = Track.artistsOf(track).map((artist) => {
    let artistName = Artist.nameOf(artist);
    return <div key={artistName}>{artistName}</div>;
  });

  const durationView = <p>{Duration.formatted(Track.durationOf(track))}</p>;

  return (
    <div>
      {nameView}
      {artistViews}
      {durationView}
    </div>
  );
}
