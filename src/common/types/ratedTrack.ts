import { Artist } from './artist';
import { Track } from './track';

declare const tag: unique symbol;

/**
 * A ratedTrack that is stored in the History of the Party
 */
export interface RatedTrack {
  readonly track: Track;
  readonly rating: Rating;
  readonly [tag]: 'RatedTrack';
}

/**
 * A Rating
 */
export interface Rating {
  readonly likes: Likes;
  readonly dislikes: Dislikes;
  readonly [tag]: 'Rating';
}

/**
 * A like with the amount of likes and the userIds
 */
export interface Likes {
  readonly amount: number;
  readonly userIds: UserId[];
  readonly [tag]: 'Likes';
}

/**
 * A Dislike with the amount of dislikes and the userIds
 */
export interface Dislikes {
  readonly amount: number;
  readonly userIds: UserId[];
  readonly [tag]: 'Dislikes';
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
   */
  export function makeRating(likes: Likes, dislikes: Dislikes): Rating {
    return Object.freeze({ likes, dislikes } as Rating);
  }

  /**
   * Makes a new Like
   * @param amount The likes
   * @param userIds The userIds
   */
  export function makeLike(amount: number, userIds: UserId[]): Likes {
    return Object.freeze({ amount, userIds } as Likes);
  }

  /**
   * Makes a new Dislike
   * @param amount The likes
   * @param userIds The userIds
   */
  export function makeDislike(amount: number, userIds: UserId[]): Dislikes {
    return Object.freeze({ amount, userIds } as Dislikes);
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
