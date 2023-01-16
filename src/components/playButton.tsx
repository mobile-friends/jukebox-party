import Button from './elements/button';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { JukeClient } from '@common/jukeClient';
import { useState } from 'react';
import { PartyCode } from '@common/types/partyCode';

interface Props {
  /**
   * Whether the playback is currently playing
   */
  isPlaying: boolean;
  /**
   * The current party-code
   */
  partyCode: PartyCode;
}

/**
 * A button to display and change the current playback state
 * @constructor
 */
export default function PlayButton({ isPlaying, partyCode }: Props) {
  const [isDisabled, setIsDisabled] = useState(false);
  const icon = isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill />;

  async function onButtonClicked() {
    setIsDisabled(true);
    // Flip the playback state to the opposite of what it is currently
    await JukeClient.setPlayback(partyCode, !isPlaying);
    setIsDisabled(false);
  }

  function onDisabledButtonClicked() {
    // Do nothing
  }

  return (
    <Button
      styleType='icon-only big'
      content={icon}
      onClick={!isDisabled ? onButtonClicked : onDisabledButtonClicked}
    />
  );
}
