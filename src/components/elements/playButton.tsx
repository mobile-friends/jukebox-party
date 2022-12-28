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
  let { data: session } = useSession() as any;

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
          type='icon-only big'
          icon={<BsFillPauseFill />}
          onClick={trySendPauseRequest}
        />
      ) : (
        <Button
          type='icon-only big'
          icon={<BsFillPlayFill />}
          onClick={trySendPlayRequest}
        />
      )}
    </div>
  );
}
