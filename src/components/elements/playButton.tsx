import Button from './button';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { JukeClient } from '@common/jukeClient';
import { usePartyCode } from '@hook/usePartyCode';

interface Props {
  isPlaying: boolean;
}

export default function PlayButton({ isPlaying }: Props) {
  const partyCode = usePartyCode();
  const icon = isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill />;

  async function onButtonClicked() {
    // Flip the playback state to the opposite of what it is currently
    await JukeClient.setPlayback(partyCode, !isPlaying);
  }

  return (
    <Button
      styleType='icon-only big'
      content={icon}
      onClick={onButtonClicked}
    />
  );
}
