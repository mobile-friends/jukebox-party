import { Artist } from './artist';
import { Track } from './track';

declare const tag: unique symbol;

/**
 * A ratedTrack that is stored in the History of the Party
 */
export interface RatedTrack {
  readonly track: Track;
  readonly rating: Rating;
  readonly [tag]: 'Track';
}

/**
 * A Rating
 */
export interface Rating {
  readonly likes: number;
  readonly dislikes: number;
  readonly userIds: string[];
  readonly [tag]: 'Rating';
}

/**
 * Contains functions for working with ratedTracks
 */
export namespace RatedTrack {
  /**
   * Makes a new ratedTrack
   * @param track The track
   * @param rating The tracks rating
   */
  export function make(track: Track, rating: Rating): RatedTrack {
    return Object.freeze({ track, rating } as RatedTrack);
  }

  /**
   * Makes a new Rating
   * @param likes The likes
   * @param dislikes The dislikes
   * @param userIds The users who rated the track
   */
  export function makeRating(
    likes: number,
    dislikes: number,
    userIds: string[]
  ): Rating {
    return Object.freeze({ likes, dislikes, userIds } as Rating);
  }

  /**
   * Gets the name of a ratedTrack
   * @param ratedTrack The ratedTrack
   */
  export function nameOf(ratedTrack: RatedTrack): string {
    return ratedTrack.track.name;
  }

  /**
   * Gets the artists of a ratedTrack
   * @param ratedTrack The ratedTrack
   */
  export function artistsOf(ratedTrack: RatedTrack): Artist[] {
    return ratedTrack.track.artists;
  }

  /**
   * Gets the ratedTrack album-art url
   * @param ratedTrack The ratedTrack
   */
  export function albumArtUrlOf(ratedTrack: RatedTrack): string {
    return ratedTrack.track.albumArtUrl;
  }

  /**
   * Gets the id of the ratedTrack
   * @param ratedTrack The ratedTrack
   */
  export function idOf(ratedTrack: RatedTrack): string {
    return ratedTrack.track.id;
  }

  /**
   * Gets the rating of the ratedTrack
   * @param ratedTrack The ratedTrack
   */
  export function ratingOf(ratedTrack: RatedTrack): Rating {
    return ratedTrack.rating;
  }
}
