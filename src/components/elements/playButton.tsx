import Button from './button';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { JukeClient } from '@common/jukeClient';
import { usePartyCode } from '@hook/usePartyCode';

interface Props {
  isPlaying: boolean;
}

export default function PlayButton({ isPlaying }: Props) {
  const partyCode = usePartyCode();

  async function trySendPlayRequest() {
    await JukeClient.setPlayback(partyCode, true);
  }

  async function trySendPauseRequest() {
    await JukeClient.setPlayback(partyCode, false);
  }

  return (
    <div>
      {isPlaying ? (
        <Button
          styleType='icon-only big'
          content={<BsFillPauseFill />}
          onClick={trySendPauseRequest}
        />
      ) : (
        <Button
          styleType='icon-only big'
          content={<BsFillPlayFill />}
          onClick={trySendPlayRequest}
        />
      )}
    </div>
  );
}
