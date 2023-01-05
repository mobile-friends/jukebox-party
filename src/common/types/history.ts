import { Track } from './track';

declare const tag: unique symbol;

//TODO: Bewertungen auch in der History speichern, also Objekt erweitern

/**
 * A History
 */
export interface History {
  readonly tracks: Track[];
}

/**
 * Contains functions for working with history
 */
export namespace History {
  /**
   * Constructor function for History
   * @param tracks The track which was playing
   */
  export function make(tracks: Track[]): History {
    return Object.freeze({ tracks } as History);
  }

  /**
   * Adds a track to the history and returns the updated history
   * @param history The History
   * @param track The Track
   */
  export function addTrackTo(history: History, track: Track): History {
    const newTrack = [...history.tracks, track];
    return make(newTrack);
  }
}
