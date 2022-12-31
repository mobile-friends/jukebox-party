import ProgressBar from './progressBar';
import PlayButton from './playButton';
import NextAndPreviousButton from './skipButton';
import styles from '../../styles/components/playbackView.module.scss';
import { PlaybackState } from '@common/types/playbackState';
import { Duration } from '@common/types/duration';
import { SkipDirection } from '@common/types/constants';

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
      <div>
        <ProgressBar
          progress={playbackState.playTime}
          duration={trackDuration}
        ></ProgressBar>
        <div className={styles.row}>
          <label>{progressText}</label>
          <label>{trackDurationText}</label>
        </div>
        <div className={styles.buttonContainer}>
          <NextAndPreviousButton
            skipDirection={SkipDirection.Backward}
          ></NextAndPreviousButton>
          <PlayButton isPlaying={playbackState.isPlaying} />
          <NextAndPreviousButton
            skipDirection={SkipDirection.Forward}
          ></NextAndPreviousButton>
        </div>
      </div>
    </div>
  );
}
