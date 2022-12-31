import ProgressBar from './progressBar';
import PlayButton from './playButton';
import NextAndPreviousButton from './skipButton';
import styles from '../../styles/components/playbackView.module.scss';
import { PlaybackState } from '@common/types/playbackState';
import { Duration } from '@common/types/duration';
import { PartyCode } from '@common/types/partyCode';
import { SkipDirection } from '@common/types/constants';

export interface PlaybackViewProps {
  playbackState: PlaybackState;
  trackDuration: Duration;
  partyCode: PartyCode;
}

export default function PlaybackView({
  playbackState,
  trackDuration,
  partyCode,
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
            partyCode={partyCode}
            skipDirection={SkipDirection.Backward}
          ></NextAndPreviousButton>
          <PlayButton
            isPlaying={playbackState.isPlaying}
            partyCode={partyCode}
          />
          <NextAndPreviousButton
            partyCode={partyCode}
            skipDirection={SkipDirection.Forward}
          ></NextAndPreviousButton>
        </div>
      </div>
    </div>
  );
}
