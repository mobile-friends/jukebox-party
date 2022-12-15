import { Track } from '@common/types/track';
import { Artist } from '@common/types/artist';
import { PlaybackState } from '@common/types/playbackState';
import PlaybackView from './playbackView';

export interface TrackViewProps {
  track: Track;
  playbackState: PlaybackState;
}

export default function TrackView({ track, playbackState }: TrackViewProps) {
  const albumArt = <img src={Track.albumArtUrlOf(track)} alt='Album art' />;

  const nameView = <p>{Track.nameOf(track)}</p>;

  const artistViews = Track.artistsOf(track).map((artist, i, row) => {
    let artistName =
      i + 1 !== row.length
        ? Artist.nameOf(artist) + ','
        : Artist.nameOf(artist);
    return <div key={artistName}>{artistName}</div>;
  });

  return (
    <div>
      <div style={{ textAlign: 'center' }}>{albumArt}</div>
      <div
        style={{ fontSize: '1.5em', fontWeight: 'bold', marginLeft: '15px' }}
      >
        {nameView}
      </div>
      <div style={{ marginLeft: '15px', marginTop: '5px', display: 'flex' }}>
        {artistViews}
      </div>
      <PlaybackView
        playbackState={playbackState}
        trackDuration={Track.durationOf(track)}
      />
    </div>
  );
}
