import * as fc from 'fast-check';
import { arbDuration } from './duration';
import { PlaybackState } from '@common/types/playbackState';
import { Track } from '@common/types/track';
import { Duration } from '@common/types/duration';

const testTrack = Track.make('Wow', Duration.Zero, [], '', 'asdf0987', []);

export const arbPlaybackState = fc
  .tuple(arbDuration, fc.boolean())
  .map(([playTime, isPlaying]) =>
    PlaybackState.make(testTrack, playTime, isPlaying)
  );
