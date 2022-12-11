import * as fc from 'fast-check';
import { arbDuration } from './duration';
import { PlaybackState } from '@src/lib/playbackState';

export const arbPlaybackState = fc
  .tuple(arbDuration, fc.boolean())
  .map(([playTime, isPlaying]) => PlaybackState.make(playTime, isPlaying));
