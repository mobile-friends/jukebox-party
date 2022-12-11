import { Track } from '@src/lib/track';
import { Artist } from '@src/lib/artist';
import { PlaybackState } from '@src/lib/playbackState';
import PlaybackView from './playbackView';

export interface TrackViewProps {
  track: Track;
  playbackState: PlaybackState;
}

export default function TrackView({ track, playbackState }: TrackViewProps) {
  const albumArt = <img src={Track.albumArtUrlOf(track)} alt='Album art' />;

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
      <PlaybackView
        playbackState={playbackState}
        trackDuration={Track.durationOf(track)}
      />
    </div>
  );
}
