import PlaybackView from './playbackView';
import styles from '../../styles/components/trackView.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Track } from '@common/types/track';
import { PlaybackState } from '@common/types/playbackState';

export interface TrackViewProps {
  track: Track;
  playbackState: PlaybackState;
}

export default function TrackView({ track, playbackState }: TrackViewProps) {
  const marqueeWrapperRef = useRef<HTMLParagraphElement>(null);
  const marqueeTextRef = useRef<HTMLSpanElement>(null);
  const [showMarqueeBlur, setShowMarqueeBlur] = useState(false);

  const artistViews = Track.artistsOf(track)
    .map((artist) => artist.name)
    .join(', ');

  useEffect(() => {
    console.log('setting show marquee blur');
    setShowMarqueeBlur(
      (marqueeTextRef.current?.clientWidth ?? 0) >
        (marqueeWrapperRef.current?.clientWidth ?? 0)
    );
  }, [track.name]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        padding: '0 20px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <img
          style={{ maxWidth: '100%' }}
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
      <p style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
        {artistViews}
      </p>
      <PlaybackView
        playbackState={playbackState}
        trackDuration={Track.durationOf(track)}
      />
    </div>
  );
}
