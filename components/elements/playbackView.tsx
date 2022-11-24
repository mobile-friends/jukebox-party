import { PlaybackState } from '../../lib/playbackState';
import { Duration } from '../../lib/duration';

export interface PlaybackViewProps {
  playbackState: PlaybackState;
  trackDuration: Duration;
}

export default function PlaybackView({
  playbackState,
  trackDuration,
}: PlaybackViewProps) {
  return (
    <span>
      {`${
        PlaybackState.isPlaying(playbackState) ? 'Playing' : 'Paused'
      } ${Duration.formatted(
        PlaybackState.playTimeOf(playbackState)
      )} / ${Duration.formatted(trackDuration)}`}
    </span>
  );
}
