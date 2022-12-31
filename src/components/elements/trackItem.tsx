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
  let artistName = Artist.nameOf(artist);
  // TODO: Use unique artist id for key
  return <div key={artistName}>{artistName}</div>;
}

/**
 * An entry in the queue track-list
 * @constructor
 */
export default function TrackItem({ track }: Props) {
  const artists = Track.artistsOf(track).map(ArtistView);
  return (
    // TODO: Use unique track id for key
    <li className={styles.row} key={track.name}>
      <img src={Track.albumArtUrlOf(track)} alt='Album art' />
      <div className='textInfo'>
        <p>{Track.nameOf(track)}</p>
        {artists}
      </div>
    </li>
  );
}
