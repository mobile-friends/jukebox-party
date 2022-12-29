import Button from './button';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { useSession } from 'next-auth/react';
import { JukeClient } from '@common/jukeClient';
import { PartyCode } from '@common/types/partyCode';

export interface PlayButtonProps {
  isPlaying: boolean;
  partyCode: PartyCode;
}

export default function playButton({ isPlaying, partyCode }: PlayButtonProps) {
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
