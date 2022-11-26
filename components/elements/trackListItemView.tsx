import { Artist } from '../../lib/artist';
import { Track } from '../../lib/track';
import styles from '../../styles/components/trackListItemView.module.scss';

export interface TrackListItemViewProps {
  track: Track;
}

export default function TrackListItemView({ track }: TrackListItemViewProps) {
  const albumArt = <img src={Track.albumArtUrlOf(track)} alt='Album art' />;

  const nameView = <p className='title'>{Track.nameOf(track)}</p>;

  const artistViews = Track.artistsOf(track).map((artist) => {
    let artistName = Artist.nameOf(artist);
    return <div key={artistName}>{artistName}</div>;
  });

  return (
    <li className={styles.row}>
      {albumArt}
      {nameView}
      {artistViews}
    </li>
  );
}
