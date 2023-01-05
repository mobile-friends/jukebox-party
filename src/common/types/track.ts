import { Artist } from './artist';
import { Duration } from './duration';

declare const tag: unique symbol;

/**
 * A track that can be played
 */
export interface Track {
  readonly name: string;
  readonly duration: Duration;
  readonly artists: Artist[];
  readonly albumArtUrl: string;
  readonly [tag]: 'Track';
  readonly id?: string;
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
   * @param albumArtUrl The url to the tracks album art
   */
  export function make(
    name: string,
    duration: Duration,
    artists: Artist[],
    albumArtUrl: string,
    id?: string
  ): Track {
    return Object.freeze({ name, duration, artists, albumArtUrl, id } as Track);
  }

  /**
   * Gets the name of a track
   * @param track The track
   */
  export function nameOf(track: Track): string {
    return track.name;
  }

  /**
   * Gets the duration of a track
   * @param track The track
   */
  export function durationOf(track: Track): Duration {
    return track.duration;
  }

  /**
   * Gets the artists of a track
   * @param track The track
   */
  export function artistsOf(track: Track): Artist[] {
    return track.artists;
  }

  /**
   * Gets the tracks album-art url
   * @param track The track
   */
  export function albumArtUrlOf(track: Track): string {
    return track.albumArtUrl;
  }
}
