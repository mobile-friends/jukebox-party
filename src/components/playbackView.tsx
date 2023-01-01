import ProgressBar from './elements/progressBar';
import PlayButton from './playButton';
import NextAndPreviousButton from './skipButton';
import styles from '@style/components/playbackView.module.scss';
import { PlaybackState } from '@common/types/playbackState';
import { Duration } from '@common/types/duration';
import { SkipDirection } from '@common/types/constants';
import { PartyCode } from '@common/types/partyCode';

interface Props {
  playbackState: PlaybackState;
  trackDuration: Duration;
  partyCode: PartyCode;
}

export default function PlaybackView({
  playbackState,
  trackDuration,
  partyCode,
}: Props) {
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
      </div>
    </div>
  );
}
