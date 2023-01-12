import styles from '@style/components/ratingWrapper.module.scss';
import { useEffect, useState } from 'react';
import { PlaybackState } from '@common/types/playbackState';
import { PartyCode } from '@common/types/partyCode';
import { useSession } from 'next-auth/react';
import { JukeClient } from '@common/jukeClient';
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
  const track = PlaybackState.trackOf(playbackState);
  const userId = data?.user.id;

  const [isAllowedToRate, setIsAllowedToRate] = useState(true);
  const [ratingState, setRatingState] = useState('');

  useEffect(() => {
    isUserAllowedToRate();
  });

  async function trySaveRating(rating: string) {
    await isUserAllowedToRate();
    if (isAllowedToRate) saveRatingToRatedTrack(rating);
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
        setIsAllowedToRate(false);
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
    const currentTrackInfo = await getCurrentHistoryTrack();

    if (userId) {
      const userRating = await getUserRatingFromCurrentTrack();
      setRatingState(userRating === undefined ? '' : userRating);
    }

    if (currentTrackInfo) {
      currentTrackInfo.rating.likes.userIds?.find((id) => id === userId)
        ? setIsAllowedToRate(false)
        : currentTrackInfo.rating.dislikes.userIds?.find((id) => id === userId)
        ? setIsAllowedToRate(false)
        : setIsAllowedToRate(true);
    }
    return;
  }

  async function getCurrentHistoryTrack() {
    const result = await getHistory();
    switch (result.code) {
      case StatusCodes.OK:
        return result.content.history.tracks.find(
          (t) => t.track.id === track.id
        );
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

  async function getHistory() {
    return JukeClient.getHistory(partyCode);
  }

  async function getUserRatingFromCurrentTrack() {
    const result = await getUserRating();
    switch (result.code) {
      case StatusCodes.OK:
        return result.content.rating;
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

  async function getUserRating() {
    return JukeClient.getUserRating(partyCode, track.id, userId!);
  }

  return (
    <div className={styles.container}>
      <Button
        styleType={`icon-only rating ${
          !isAllowedToRate
            ? ratingState === 'like'
              ? 'bg-highlight'
              : 'disabled'
            : ''
        }`}
        content={<AiFillLike />}
        onClick={() => trySaveRating('like')}
      />

      <Button
        styleType={`icon-only rating ${
          !isAllowedToRate
            ? ratingState === 'dislike'
              ? 'bg-highlight'
              : 'disabled'
            : ''
        }`}
        content={<AiFillDislike />}
        onClick={() => trySaveRating('dislike')}
      />
    </div>
  );
}
