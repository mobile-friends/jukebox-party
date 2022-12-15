import { Duration } from './duration';

declare const tag: unique symbol;

/**
 * Contains information about the playback state of a track
 */
export interface PlaybackState {
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
   * @param playTime How long the track has been playing for
   * @param isPlaying Whether the track is playing
   */
  export function make(playTime: Duration, isPlaying: boolean): PlaybackState {
    return { playTime, isPlaying } as PlaybackState;
  }

  /**
   * Makes a playing playback-state
   * @param playTime How long the track has been playing for
   */
  export function makePlaying(playTime: Duration): PlaybackState {
    return make(playTime, true);
  }

  /**
   * Makes a paused playback-state
   * @param playTime How long the track has been playing for
   */
  export function makePaused(playTime: Duration): PlaybackState {
    return make(playTime, false);
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

  /**
   * Toggles the state from playing to paused and the other way around
   * @param state The current state
   */
  export function togglePlaying(state: PlaybackState): PlaybackState {
    return make(playTimeOf(state), !isPlaying(state));
  }
}
