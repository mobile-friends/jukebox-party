import { Track } from '../../lib/track';
import { Artist } from '../../lib/artist';
import { PlaybackState } from '../../lib/playbackState';
import PlaybackView from './playbackView';

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

  return (
    <div>
      {nameView}
      {artistViews}
      <PlaybackView
        playbackState={playbackState}
        trackDuration={Track.durationOf(track)}
      />
    </div>
  );
}
