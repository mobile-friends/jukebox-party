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
    await play(session.user.accessToken);
  }

  async function trySendPauseRequest() {
    await pause(session.user.accessToken);
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
