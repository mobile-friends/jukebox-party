import ProgressBar from './progressBar';
import PlayButton from './playButton';
import NextAndPreviousButton from './nextAndPreviousButton';
import styles from '../../styles/components/playbackView.module.scss';
import { PlaybackState } from '@common/types/playbackState';
import { Duration } from '@common/types/duration';
import { PartyCode } from '@common/types/partyCode';

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
          <NextAndPreviousButton next={false}></NextAndPreviousButton>
          <PlayButton
            isPlaying={playbackState.isPlaying}
            partyCode={partyCode}
          />
          <NextAndPreviousButton next={true}></NextAndPreviousButton>
        </div>
      </div>
    </div>
  );
}
