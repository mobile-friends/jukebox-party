import Button from './button';

import { pause, play } from '../../httpClient/spotify/player';

import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { useSession } from 'next-auth/react';

export interface PlayButtonProps {
  isPlaying: boolean;
}

export default function playButton({ isPlaying }: PlayButtonProps) {
  let { data: session } = useSession() as any;

  async function trySendPlayRequest() {
    try {
      await play(session.user.accessToken);
    } catch (e) {
      console.log(e);
    }
  }

  async function trySendPauseRequest() {
    try {
      await pause(session.user.accessToken);
    } catch (e) {
      console.log(e);
    }
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
