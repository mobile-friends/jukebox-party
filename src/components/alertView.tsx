import { PartyCode } from '@common/types/partyCode';
import { Track } from '@common/types/track';
import Button from './elements/button';
import { JukeClient } from '@common/jukeClient';
import { toast } from 'react-toastify';

interface Props {
  /**
   * The track to display
   */
  track: Track;

  /**
   * The party code, needed for adding the track to the queue
   */
  partyCode: PartyCode;

  /**
   * The close function to close the alert
   */
  onClose: () => void;
}

export default function AlertView({ track, partyCode, onClose }: Props) {
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
      type: 'success',
    });
  };

  async function onAddButtonClicked() {
    await JukeClient.addToQueue(partyCode, track).then(() => {
      notify();
    });
  }

  return (
    <div className='alertWrapper'>
      <h1>Do you want to add {track.name} to the queue?</h1>
      <Button
        content='Yes, add it'
        styleType='primary block'
        onClick={onAddButtonClicked}
      />
      <Button
        content='No, do not add it'
        styleType='secondary block'
        onClick={onClose}
      />
    </div>
  );
}
