import { Party } from './party';
import { RatedTrack, Rating } from './ratedTrack';
import { Track } from './track';

declare const tag: unique symbol;

/**
 * A History
 */
export interface History {
  readonly tracks: RatedTrack[];
  readonly [tag]: 'History';
}

/**
 * Contains functions for working with history
 */
export namespace History {
  /**
   * Constructor function for History
   * @param tracks The tracks in the history
   */
  export function make(tracks: RatedTrack[]): History {
    return Object.freeze({ tracks } as History);
  }

  /**
   * Adds a track to the history and returns the updated history
   * @param history The History
   * @param track The Track
   */
  export function addTrackTo(history: History, track: Track): History {
    const emptyRating = RatedTrack.makeRating(0, 0, []);
    const ratedTrack = RatedTrack.make(track, emptyRating);
    const newTracks = [...history.tracks, ratedTrack];
    return make(newTracks);
  }

  /**
   * Adds a track to the history and returns the updated history
   * @param history The History
   * @param track The Track
   */
  export function addRatedTrackTo(
    history: History,
    ratedTrack: RatedTrack
  ): History {
    const newTracks = [...history.tracks, ratedTrack];
    return make(newTracks);
  }
}
