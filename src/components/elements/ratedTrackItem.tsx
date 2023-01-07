import styles from '@style/components/historyTrackListItemView.module.scss';
import { Artist } from '@common/types/artist';
import { RatedTrack, Rating } from '@common/types/ratedTrack';
import { AiFillDislike, AiFillLike } from 'react-icons/ai';

interface Props {
  /**
   * The ratedTrack to display
   */
  ratedTrack: RatedTrack;
  //The total user Amount to get the percentages of the ratings
  userAmount: number;
}

function ArtistView(artist: Artist) {
  const artistName = Artist.nameOf(artist);
  const artistId = Artist.idOf(artist);
  return (
    <div className={styles.artistText} key={artistId}>
      {artistName}
    </div>
  );
}

function RatingView(rating: Rating, userAmount: number) {
  const likePercentage = Math.round((rating.likes / userAmount) * 100);
  const dislikePercentage = Math.round((rating.dislikes / userAmount) * 100);
  const ratingPercentage =
    likePercentage >= dislikePercentage ? likePercentage : dislikePercentage;
  return (
    <div>
      {likePercentage >= dislikePercentage ? (
        <AiFillLike size={32} color='#ece32f' />
      ) : (
        <AiFillDislike size={32} color='#ece32f' />
      )}
      <p className={styles.ratingText}>{ratingPercentage}%</p>
    </div>
  );
}

/**
 * An entry in the history track-list
 * @constructor
 */
export default function RatedTrackItem({ ratedTrack, userAmount }: Props) {
  const artists = RatedTrack.artistsOf(ratedTrack).map(ArtistView);
  return (
    <li className={styles.row} key={ratedTrack.track.id}>
      <div className={styles.imageTextWrapper}>
        <img src={RatedTrack.albumArtUrlOf(ratedTrack)} alt='Album art' />
        <div className={styles.textInfo}>
          <p>{RatedTrack.nameOf(ratedTrack)}</p>
          {artists}
        </div>
      </div>
      {ratedTrack.rating.likes !== 0 || ratedTrack.rating.dislikes !== 0 ? (
        <div className={styles.ratingWrapper}>
          {RatingView(ratedTrack.rating, userAmount)}
        </div>
      ) : (
        <></>
      )}
    </li>
  );
}
