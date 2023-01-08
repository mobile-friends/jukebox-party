import styles from '@style/components/ratingWrapper.module.scss';
import { useEffect, useState } from 'react';
import { PlaybackState } from '@common/types/playbackState';
import { PartyCode } from '@common/types/partyCode';
import { useSession } from 'next-auth/react';
import useLivePartyUsers from '@hook/useLivePartyUsers';
import { JukeClient } from '@common/jukeClient';
import { SaveTrackToHistoryResult } from '@endpoint/saveTrackToHistory';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import { SaveRatingToRatedTrackResult } from '@endpoint/saveRatingToRatedTrack';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import Button from './elements/button';

interface Props {
  /**
   * The current playback-state
   */
  playbackState: PlaybackState;
  partyCode: PartyCode;
}

/**
 * Displays the currently played track
 * @constructor
 */
export default function RatingWrapper({ playbackState, partyCode }: Props) {
  const { data } = useSession();
  const users = useLivePartyUsers(partyCode);
  const partyHostId = users?.host.id;
  const userId = data?.user.id;

  const [allowedToRate, setAllowedToRate] = useState(false);

  const track = PlaybackState.trackOf(playbackState);


  useEffect(() => {
    saveTrackToHistory();
    //bug workaround
    const interval = setInterval(isUserAllowedToRate, 3000);
    return () => clearInterval(interval);
  }, [track.name]);

  async function saveTrackToHistory() {
    await JukeClient.saveTrackToHistory(partyCode, {
      track: track,
    })
      .then(onSaveTrackToHistoryResult)
      .catch(console.error);
  }

  function onSaveTrackToHistoryResult(result: SaveTrackToHistoryResult) {
    switch (result.code) {
      case StatusCodes.NO_CONTENT: //everything worked out
        return;
      case StatusCodes.BAD_REQUEST:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_FOUND:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle error [JUKE-142]
        break;
      default:
        return assertNeverReached(result);
    }
  }

  async function saveRatingToRatedTrack(rating: string) {
    if (userId) {
      await JukeClient.saveRatingToRatedTrack(partyCode, {
        track: track,
        rating: rating,
        userId: userId,
      })
        .then(onSaveRatingToRatedTrack)
        .catch(console.error);
    }
  }

  function onSaveRatingToRatedTrack(result: SaveRatingToRatedTrackResult) {
    switch (result.code) {
      case StatusCodes.NO_CONTENT: //everything worked out
        setAllowedToRate(false);
        return;
      case StatusCodes.BAD_REQUEST:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_FOUND:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle error [JUKE-142]
        break;
      default:
        return assertNeverReached(result);
    }
  }

  async function isUserAllowedToRate() {
    const result = await getHistory();
    switch (result.code) {
      case StatusCodes.OK:
        const currentHistoryTrack = result.content.history.tracks.find(
          (t) => t.track.id === track.id
        );
        if (currentHistoryTrack) {
          const allUserIds = currentHistoryTrack.rating.userIds;
          if (allUserIds?.find((id) => id === userId)) {
            setAllowedToRate(false);
          } else {
            setAllowedToRate(true);
          }
        }
        return;
      case StatusCodes.BAD_REQUEST:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_FOUND:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle error [JUKE-142]
        break;
      default:
        return assertNeverReached(result);
    }
  }

  function getHistory() {
    return JukeClient.getHistory(partyCode);
  }

  return (
    <div className={styles.container}>
      <Button
        styleType='icon-only rating bg-green'
        content={<AiFillLike />}
        onClick={() => saveRatingToRatedTrack('like')}
      />

      <Button
        styleType={`icon-only rating bg-red`}
        content={<AiFillDislike />}
        onClick={() => saveRatingToRatedTrack('dislike')}
      />
    </div>
  );
}
