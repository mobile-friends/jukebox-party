import styles from '@style/components/trackListItemView.module.scss';
import { Track } from '@common/types/track';
import { Artist } from '@common/types/artist';
import { PartyCode } from '@common/types/partyCode';
import { ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AlertView from '@component/alertView';

interface Props {
  /**
   * The track to display
   */
  track: Track;

  /**
   * Whether or not the track can be added to the queue
   */
  canBeQueued: boolean;

  /**
   * The party code, needed for adding the track to the queue
   */
  partyCode: PartyCode;
}

function ArtistView(artist: Artist) {
  const artistName = Artist.nameOf(artist);
  const artistId = Artist.idOf(artist);
  return (
    <span className={styles.artist} key={artistId}>
      {artistName}
    </span>
  );
}

/**
 * An entry in the queue track-list
 * @constructor
 */
export default function TrackItem({ track, canBeQueued, partyCode }: Props) {
  const artists = Track.artistsOf(track).map(ArtistView);
  const confirm = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertView
            track={track}
            partyCode={partyCode}
            onClose={onClose}
          ></AlertView>
        );
      },
    });
  };

  return (
    <li
      className={styles.row}
      key={track.id}
      onClick={() => {
        if (canBeQueued) {
          confirm();
        }
      }}
    >
      <img src={Track.albumArtUrlOf(track)} alt='Album art' />
      <div className='textInfo'>
        <p>{Track.nameOf(track)}</p>
        {artists}
      </div>
      <ToastContainer />
    </li>
  );
}
