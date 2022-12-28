import Button from './button';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { useSession } from 'next-auth/react';
import { pause, play } from '@httpClient/jukebox/playback';

export interface PlayButtonProps {
  isPlaying: boolean;
}

export default function playButton({ isPlaying }: PlayButtonProps) {
  let { data: session } = useSession() as any;

  async function trySendPlayRequest() {
    await play();
  }

  async function trySendPauseRequest() {
    await pause();
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
