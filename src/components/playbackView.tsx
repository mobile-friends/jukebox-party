import ProgressBar from './elements/progressBar';
import PlayButton from './playButton';
import NextAndPreviousButton from './skipButton';
import styles from '@style/components/playbackView.module.scss';
import { PlaybackState } from '@common/types/playbackState';
import { Duration } from '@common/types/duration';
import { SkipDirection } from '@common/types/constants';

interface Props {
  playbackState: PlaybackState;
  trackDuration: Duration;
}

export default function PlaybackView({ playbackState, trackDuration }: Props) {
  const progressText = Duration.formatted(
    PlaybackState.playTimeOf(playbackState)
  );

  const trackDurationText = Duration.formatted(trackDuration);

  return (
    <div>
      <div>
        <ProgressBar
          progress={playbackState.playTime}
          duration={trackDuration}
        />
        <div className={styles.row}>
          <label>{progressText}</label>
          <label>{trackDurationText}</label>
        </div>
        <div className={styles.buttonContainer}>
          <NextAndPreviousButton skipDirection={SkipDirection.Backward} />
          <PlayButton isPlaying={playbackState.isPlaying} />
          <NextAndPreviousButton skipDirection={SkipDirection.Forward} />
        </div>
      </div>
    </div>
  );
}
