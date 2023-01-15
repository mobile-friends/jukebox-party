import styles from '@style/components/trackListItemView.module.scss';
import { Track } from '@common/types/track';
import { Artist } from '@common/types/artist';
import { JukeClient } from '@common/jukeClient';
import { PartyCode } from '@common/types/partyCode';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

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
      title: 'Please confirm',
      message: `Do you want to add "${track.name}" to the queue?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            JukeClient.addToQueue(partyCode, track).then(() => {
              notify();
            });
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };
  const notify = () => {
    toast(`"${track.name}" has been added to queue`, {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      type: 'success'
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
