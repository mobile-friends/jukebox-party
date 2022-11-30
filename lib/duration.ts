declare const tag: unique symbol;

/**
 * Represents a time duration
 */
export type Duration = number & { readonly [tag]: 'Duration' };

/**
 * Contains functions for working with durations
 */
export namespace Duration {
  const SecondsInMinute = 60;

  /**
   * Makes a new duration of the given seconds.
   * Will be rounded up to whole seconds
   * @param seconds The seconds
   */
  export function makeFromSeconds(seconds: number): Duration {
    return Math.ceil(seconds) as Duration;
  }

  /**
   * Makes a new duration of the given seconds.
   * Will be rounded up to whole seconds
   * @param seconds The seconds
   */
  export function makeFromMiliSeconds(miliseconds: number): Duration {
    return Math.ceil(miliseconds / 1000) as Duration;
  }

  /**
   * Makes a new duration of the given minutes and seconds.
   * Will be rounded up to whole seconds
   * @param minutes The minutes
   * @param seconds The seconds
   */
  export function make(minutes: number, seconds: number): Duration {
    return makeFromSeconds(minutes * SecondsInMinute + seconds);
  }

  /**
   * Gets how many seconds are in this duration
   * @param duration The duration
   */
  export function secondsIn(duration: Duration): number {
    return duration;
  }

  /**
   * Gets home many **whole** minutes are in this duration
   * @param duration The duration
   */
  export function minutesIn(duration: Duration): number {
    return Math.floor(duration / SecondsInMinute);
  }

  /**
   * Formats this duration in the format m:s
   * @param duration The duration
   */
  export function formatted(duration: Duration): string {
    const minutes = minutesIn(duration);
    const extraSeconds = secondsIn(duration) % SecondsInMinute;
    return `${minutes}:${extraSeconds}`;
  }

  /**
   * A duration of zero seconds
   */
  export const Zero = makeFromSeconds(0);
}
