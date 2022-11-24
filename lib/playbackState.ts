declare const tag: unique symbol;

/**
 * Represents whether playback is paused or playing
 */
export type PlaybackState = boolean & { readonly [tag]: 'PlaybackState' };

/**
 * Contains logic for working with Playback-state
 */
export namespace PlaybackState {
  function make(isPlaying: boolean): PlaybackState {
    return isPlaying as PlaybackState;
  }

  /**
   * The playing state
   */
  export const Playing = make(true);
  /**
   * The paused state
   */
  export const Paused = make(false);

  /**
   * Checks whether the state is currently playing
   * @param state The state
   */
  export function isPlaying(state: PlaybackState): boolean {
    return state === Playing;
  }

  /**
   * Checks whether the state is currently paused
   * @param state The state
   */
  export function isPaused(state: PlaybackState): boolean {
    return state === Paused;
  }

  /**
   * Toggles the state from playing to paused and the other way around
   * @param state The current state
   */
  export function toggle(state: PlaybackState): PlaybackState {
    return isPlaying(state) ? Paused : Playing;
  }
}
