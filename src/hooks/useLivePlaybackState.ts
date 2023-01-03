import { PartyCode } from '@common/types/partyCode';
import { PlaybackState } from '@common/types/playbackState';
import { useEffect, useState } from 'react';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

export default function useLivePlaybackState(
  partyCode: PartyCode,
  updateFrequency = 1000
): PlaybackState | null {
  const [state, setState] = useState<PlaybackState | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function refresh() {
      const result = await JukeClient.getPlayback(partyCode);
      switch (result.code) {
        case StatusCodes.OK:
          if (result.content.kind === 'NotPlaying') setState(null);
          else setState(result.content.playbackState);
          break;
        case StatusCodes.UNAUTHORIZED:
          // TODO: Redirect to better unauthorized page
          return signOut({ callbackUrl: '/' }).catch(console.error);
        default:
          return assertNeverReached(result);
      }
    }

    if (state === null) refresh().catch(console.error);
    const interval = setInterval(refresh, updateFrequency);
    return () => clearInterval(interval);
  }, [partyCode, updateFrequency]);

  return state;
}
