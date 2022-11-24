import { Artist } from './artist';
import { Duration } from './duration';

/**
 * A track that can be played
 */
export interface Track {
  readonly name: string;
  readonly duration: Duration;
  readonly artists: Artist[];
}

/**
 * Contains functions for working with tracks
 */
export namespace Track {
  /**
   * Makes a new track
   * @param name The tracks name
   * @param duration The tracks duration
   * @param artists The tracks artists
   */
  export function make(
    name: string,
    duration: Duration,
    artists: Artist[]
  ): Track {
    return Object.freeze({ name, duration, artists });
  }

  /**
   * Gets the name of a track
   * @param track The track
   */
  export function nameOf(track: Track): string {
    return track.name;
  }

  /**
   * Gets the artists of a track
   * @param track The track
   */
  export function artistsOf(track: Track): Artist[] {
    return track.artists;
  }

  /**
   * Gets the duration of a track
   * @param track The track
   */
  export function durationOf(track: Track): Duration {
    return track.duration;
  }
}
