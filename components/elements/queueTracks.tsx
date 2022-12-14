import { Track } from '../../lib/track';
import { Artist } from '../../lib/artist';
import styles from '../../styles/components/trackListItemView.module.scss';

export interface queueTracks {
  track: Track;
}

export default function QueueTracks({ track }: queueTracks) {
  const albumArt = <img src={Track.albumArtUrlOf(track)} alt='Album art' />;

  const nameView = <p>{Track.nameOf(track)}</p>;

  const artistViews = Track.artistsOf(track).map((artist) => {
    let artistName = Artist.nameOf(artist);
    return <div key={artistName}>{artistName}</div>;
  });

  return (
    <li className={styles.row} key={track.name}>
      {albumArt}
      <div className='textInfo'>
        {nameView}
        {artistViews}
      </div>
    </li>
  );
}
