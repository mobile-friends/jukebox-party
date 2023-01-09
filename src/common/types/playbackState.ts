import { Duration } from './duration';
import { Track } from '@common/types/track';

declare const tag: unique symbol;

/**
 * Contains information about the playback state of a track
 */
export interface PlaybackState {
  readonly track: Track;
  readonly playTime: Duration;
  readonly isPlaying: boolean;
  readonly [tag]: 'PlaybackState';
}

/**
 * Contains logic for working with Playback-state
 */
export namespace PlaybackState {
  /**
   * Makes a playback-state
   * @param track The track that is playing
   * @param playTime How long the track has been playing for
   * @param isPlaying Whether the track is playing
   */
  export function make(
    track: Track,
    playTime: Duration,
    isPlaying: boolean
  ): PlaybackState {
    return Object.freeze({ track, playTime, isPlaying }) as PlaybackState;
  }

  /**
   * Makes a playing playback-state
   * @param track The track that is playing
   * @param playTime How long the track has been playing for
   */
  export function makePlaying(track: Track, playTime: Duration): PlaybackState {
    return make(track, playTime, true);
  }

  /**
   * Makes a paused playback-state
   * @param track The track that is playing
   * @param playTime How long the track has been playing for
   */
  export function makePaused(track: Track, playTime: Duration): PlaybackState {
    return make(track, playTime, false);
  }

  /**
   * Checks whether the state is currently playing
   * @param state The state
   */
  export function isPlaying(state: PlaybackState): boolean {
    return state.isPlaying;
  }

  /**
   * Checks whether the state is currently paused
   * @param state The state
   */
  export function isPaused(state: PlaybackState): boolean {
    return !state.isPlaying;
  }

  /**
   * Gets how long the track has been playing for
   * @param state The state
   */
  export function playTimeOf(state: PlaybackState): Duration {
    return state.playTime;
  }

  export function trackOf(state: PlaybackState): Track {
    return state.track;
  }
}
