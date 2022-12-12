import { PlaybackState } from '../../lib/playbackState';
import { Duration } from '../../lib/duration';
import ProgressBar from './progressBar';
import PlayButton from './playButton';
import styles from '../../styles/components/playbackView.module.scss';

export interface PlaybackViewProps {
  playbackState: PlaybackState;
  trackDuration: Duration;
}

export default function PlaybackView({
  playbackState,
  trackDuration,
}: PlaybackViewProps) {
  const progressText = Duration.formatted(
    PlaybackState.playTimeOf(playbackState)
  );

  const trackDurationText = Duration.formatted(trackDuration);

  return (
    <div>
      <div className={styles.container}>
        <PlayButton isPlaying={playbackState.isPlaying} />
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
