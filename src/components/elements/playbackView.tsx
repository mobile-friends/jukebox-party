import { PlaybackState } from '@src/lib/playbackState';
import { Duration } from '@src/lib/duration';

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
    <span>{`${isPlayingText} ${progressText} / ${trackDurationText}`}</span>
  );
}
