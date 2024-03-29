import { PartyCode } from '@common/types/partyCode';
import { PlaybackState } from '@common/types/playbackState';
import { useEffect, useState } from 'react';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import { signOut } from 'next-auth/react';
import { PagePath } from '@common/pagePath';

export default function useLivePlaybackState(
  partyCode: PartyCode,
  updateFrequency = 1000
): PlaybackState | null {
  const [state, setState] = useState<PlaybackState | null>(null);

  useEffect(() => {
    async function refresh() {
      const result = await JukeClient.getPlayback(partyCode);
      switch (result.code) {
        case StatusCodes.OK:
          if (result.content.kind === 'NotPlaying') setState(null);
          else setState(result.content.playbackState);
          break;
        case StatusCodes.UNAUTHORIZED:
          return signOut({ callbackUrl: PagePath.PartyNotFound }).catch(console.error);
        case StatusCodes.SERVICE_UNAVAILABLE:
          console.error('Playback state unavailable');
          break;
        default:
          return assertNeverReached(result);
      }
    }

    if (state === null) refresh().catch(console.error);
    const interval = setInterval(refresh, updateFrequency);
    return () => clearInterval(interval);
  }, [state, partyCode, updateFrequency]);

  return state;
}
