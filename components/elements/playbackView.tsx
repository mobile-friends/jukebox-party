import { PlaybackState } from '../../lib/playbackState';
import { Duration } from '../../lib/duration';
import ProgressBar from './progressBar';

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
      <span>{`${isPlayingText} ${progressText} / ${trackDurationText}`}</span>
      <ProgressBar
        progress={playbackState.playTime}
        duration={trackDuration}
      ></ProgressBar>
    </div>
  );
}
