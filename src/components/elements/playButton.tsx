import Button from './button';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { JukeClient } from '@common/jukeClient';
import { PartyCode } from '@common/types/partyCode';
import { usePartyCode } from '@hook/usePartyCode';

export interface PlayButtonProps {
  isPlaying: boolean;
}

export default function playButton({ isPlaying }: PlayButtonProps) {
  const partyCode = usePartyCode();

  async function trySendPlayRequest() {
    await JukeClient.startPlayback(partyCode);
  }

  async function trySendPauseRequest() {
    await JukeClient.pausePlayback(partyCode);
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
