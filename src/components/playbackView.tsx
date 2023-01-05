import styles from '@style/components/playbackView.module.scss';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Track } from '@common/types/track';
import { PlaybackState } from '@common/types/playbackState';
import { PartyCode } from '@common/types/partyCode';
import ProgressBar from '@component/elements/progressBar';
import NextAndPreviousButton from '@component/skipButton';
import { SkipDirection } from '@common/types/constants';
import PlayButton from '@component/playButton';
import { Duration } from '@common/types/duration';
import { useSession } from 'next-auth/react';
import useLivePartyUsers from '@hook/useLivePartyUsers';
import { JukeClient } from '@common/jukeClient';
import { History } from '@common/types/history';

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
export default function PlaybackView({ playbackState, partyCode }: Props) {
  const { data } = useSession();
  const users = useLivePartyUsers(partyCode);
  const partyHostId = users?.host.id;
  const userId = data?.user.id;

  const marqueeWrapperRef = useRef<HTMLParagraphElement>(null);
  const marqueeTextRef = useRef<HTMLSpanElement>(null);
  const artistRef = useRef<HTMLParagraphElement>(null);
  const [showMarqueeBlur, setShowMarqueeBlur] = useState(false);

  const track = PlaybackState.trackOf(playbackState);
  const trackDuration = Track.durationOf(track);
  const artistViews = Track.artistsOf(track)
    .map((artist) => artist.name)
    .join(', ');
  const progressText = Duration.formatted(
    PlaybackState.playTimeOf(playbackState)
  );
  const trackDurationText = Duration.formatted(trackDuration);
  const durationLeftText = Duration.formatted(
    Duration.makeFromSeconds(
      Duration.secondsIn(trackDuration) -
        Duration.secondsIn(PlaybackState.playTimeOf(playbackState))
    )
  );

  useEffect(() => {
    setShowMarqueeBlur(
      (marqueeTextRef.current?.clientWidth ?? 0) >
        (marqueeWrapperRef.current?.clientWidth ?? 0)
    );
    saveTrackToHistory(track);
  }, [track.name]);

  async function saveTrackToHistory(track: Track) {
    const result = await JukeClient.saveTrackToHistory(partyCode, {
      track: track,
    });
  }

  function getAnimationDuration(
    spanElem: RefObject<HTMLSpanElement>
  ): number | undefined {
    if (spanElem.current === null) return;
    return spanElem.current.offsetWidth / 30;
  }

  return (
    <div>
      <div className={styles.trackImg}>
        <img src={Track.albumArtUrlOf(track)} alt='Album art' />
      </div>

      <div className={styles.trackInfo}>
        <div
          ref={marqueeWrapperRef}
          className={`text-bold text-big ${styles.marquee}`}
        >
          {showMarqueeBlur && <div className={styles.shadow}></div>}
          <span
            ref={marqueeTextRef}
            style={{
              animationDuration: `${getAnimationDuration(marqueeTextRef)}s`,
            }}
          >
            {Track.nameOf(track)}
          </span>
        </div>
        <div className={styles.artists}>
          <span
            ref={artistRef}
            style={{ animationDuration: `${getAnimationDuration(artistRef)}s` }}
          >
            {artistViews}
          </span>
        </div>
      </div>

      <ProgressBar progress={playbackState.playTime} duration={trackDuration} />
      <div className={styles.row}>
        <label>{progressText}</label>
        <label>{durationLeftText}</label>
      </div>

      {userId === partyHostId ? (
        <div className={styles.buttonContainer}>
          <NextAndPreviousButton
            skipDirection={SkipDirection.Backward}
            partyCode={partyCode}
          />
          <PlayButton
            isPlaying={playbackState.isPlaying}
            partyCode={partyCode}
          />
          <NextAndPreviousButton
            skipDirection={SkipDirection.Forward}
            partyCode={partyCode}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
