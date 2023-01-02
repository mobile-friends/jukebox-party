import { PlaybackState } from '@common/types/playbackState';
import * as fc from 'fast-check';
import { arbDuration } from './arb/duration';
import { arbPlaybackState } from './arb/playbackState';
import { Track } from '@common/types/track';
import { Duration } from '@common/types/duration';

const testTrack = Track.make('Wow', Duration.Zero, [], '');

test('Starting states playing makes them playing', () => {
  fc.assert(
    fc.property(arbDuration, (playTime) => {
      const state = PlaybackState.makePlaying(testTrack, playTime);
      expect(PlaybackState.isPlaying(state)).toBe(true);
    })
  );
});

test('Starting states paused makes them paused', () => {
  fc.assert(
    fc.property(arbDuration, (playTime) => {
      const state = PlaybackState.makePaused(testTrack, playTime);
      expect(PlaybackState.isPlaying(state)).toBe(false);
    })
  );
});

test('Can only ever be playing OR paused', () => {
  fc.assert(
    fc.property(arbPlaybackState, (state) => {
      const isPlaying = PlaybackState.isPlaying(state);
      const isPaused = PlaybackState.isPaused(state);
      expect(isPlaying).not.toBe(isPaused);
    })
  );
});
