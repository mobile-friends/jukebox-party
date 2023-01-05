import styles from '@style/components/trackListItemView.module.scss';
import { Track } from '@common/types/track';
import { Artist } from '@common/types/artist';

interface Props {
  /**
   * The track to display
   */
  track: Track;
}

function ArtistView(artist: Artist) {
  const artistName = Artist.nameOf(artist);
  const artistId = Artist.idOf(artist);
  return <div key={artistId}>{artistName}</div>;
}

/**
 * An entry in the queue track-list
 * @constructor
 */
export default function TrackItem({ track }: Props) {
  const artists = Track.artistsOf(track).map(ArtistView);
  return (
    <li className={styles.row} key={track.id}>
      <img src={Track.albumArtUrlOf(track)} alt='Album art' />
      <div className='textInfo'>
        <p>{Track.nameOf(track)}</p>
        {artists}
      </div>
    </li>
  );
}
