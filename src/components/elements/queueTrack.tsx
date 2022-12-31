import styles from '../../styles/components/trackListItemView.module.scss';
import { Track } from '@common/types/track';
import { Artist } from '@common/types/artist';

interface Props {
  track: Track;
}

export default function QueueTrack({ track }: Props) {
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
