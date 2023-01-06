import styles from '@style/components/trackListItemView.module.scss';
import { Artist } from '@common/types/artist';
import { RatedTrack } from '@common/types/ratedTrack';

interface Props {
  /**
   * The ratedTrack to display
   */
  ratedTrack: RatedTrack;
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
export default function RatedTrackItem({ ratedTrack }: Props) {
  const artists = RatedTrack.artistsOf(ratedTrack).map(ArtistView);
  return (
    <li className={styles.row} key={ratedTrack.track.id}>
      <img src={RatedTrack.albumArtUrlOf(ratedTrack)} alt='Album art' />
      <div className='textInfo'>
        <p>{RatedTrack.nameOf(ratedTrack)}</p>
        {artists}
      </div>
    </li>
  );
}
