import { Track } from '../../lib/track';
import { Artist } from '../../lib/artist';
import { Duration } from '../../lib/duration';
import { PlaybackState } from '../../lib/playbackState';

export interface TrackViewProps {
  track: Track;
  playbackState: PlaybackState;
}

export default function TrackView({ track, playbackState }: TrackViewProps) {
  const nameView = <p>{Track.nameOf(track)}</p>;

  const artistViews = Track.artistsOf(track).map((artist) => {
    let artistName = Artist.nameOf(artist);
    return <div key={artistName}>{artistName}</div>;
  });

  const durationView = <p>{Duration.formatted(Track.durationOf(track))}</p>;
  const playbackStateView = (
    <p>{PlaybackState.isPlaying(playbackState) ? 'Playing' : 'Paused'}</p>
  );

  return (
    <div>
      {nameView}
      {artistViews}
      {durationView}
      {playbackStateView}
    </div>
  );
}
