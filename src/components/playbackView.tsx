import styles from '@style/components/playbackView.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Track } from '@common/types/track';
import { PlaybackState } from '@common/types/playbackState';
import { PartyCode } from '@common/types/partyCode';
import ProgressBar from '@component/elements/progressBar';
import NextAndPreviousButton from '@component/skipButton';
import { SkipDirection } from '@common/types/constants';
import PlayButton from '@component/playButton';
import { Duration } from '@common/types/duration';

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
  const marqueeWrapperRef = useRef<HTMLParagraphElement>(null);
  const marqueeTextRef = useRef<HTMLSpanElement>(null);
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

  useEffect(() => {
    setShowMarqueeBlur(
      (marqueeTextRef.current?.clientWidth ?? 0) >
        (marqueeWrapperRef.current?.clientWidth ?? 0)
    );
  }, [track.name]);

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
          <span ref={marqueeTextRef}>{Track.nameOf(track)}</span>
        </div>
        <p>{artistViews}</p>
      </div>

      <ProgressBar progress={playbackState.playTime} duration={trackDuration} />

      <div className={styles.row}>
        <label>{progressText}</label>
        <label>{trackDurationText}</label>
      </div>
      
      <div className={styles.buttonContainer}>
        <NextAndPreviousButton
          skipDirection={SkipDirection.Backward}
          partyCode={partyCode}
        />
        <PlayButton isPlaying={playbackState.isPlaying} partyCode={partyCode} />
        <NextAndPreviousButton
          skipDirection={SkipDirection.Forward}
          partyCode={partyCode}
        />
      </div>
    </div>
  );
}
