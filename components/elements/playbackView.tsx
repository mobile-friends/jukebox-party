import { PlaybackState } from '../../lib/playbackState';
import { Duration } from '../../lib/duration';
import ProgressBar from './progressBar';
import styles from '../../styles/components/playbackView.module.scss';

export interface PlaybackViewProps {
  playbackState: PlaybackState;
  trackDuration: Duration;
}

export default function PlaybackView({
  playbackState,
  trackDuration,
}: PlaybackViewProps) {
  const isPlayingText = PlaybackState.isPlaying(playbackState)
    ? 'Playing'
    : 'Paused';

  const progressText = Duration.formatted(
    PlaybackState.playTimeOf(playbackState)
  );

  const trackDurationText = Duration.formatted(trackDuration);

  return (
    <div>
      <label>{isPlayingText}</label>
      <div className={styles.container}>
        <ProgressBar
          progress={playbackState.playTime}
          duration={trackDuration}
        ></ProgressBar>
        <div className={styles.row}>
          <label>{progressText}</label>
          <label>{trackDurationText}</label>
        </div>
      </div>
    </div>
  );
}
