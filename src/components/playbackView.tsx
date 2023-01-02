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

  // TODO: Extract style to scss
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 20px',
      }}
    >
      <div style={{ flexGrow: 1, textAlign: 'center' }}>
        <img
          style={{ height: 0, minHeight: '100%', objectFit: 'cover' }}
          src={Track.albumArtUrlOf(track)}
          alt='Album art'
        />
      </div>
      <p
        ref={marqueeWrapperRef}
        className={styles.marquee}
        style={{ fontSize: '1.5em', fontWeight: 'bold' }}
      >
        {showMarqueeBlur && <div className={styles.shadow}></div>}
        <span ref={marqueeTextRef}>{Track.nameOf(track)}</span>
      </p>
      <p style={{ display: 'flex', marginBottom: '0.75rem' }}>{artistViews}</p>
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
