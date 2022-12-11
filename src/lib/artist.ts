declare const tag: unique symbol;

/**
 * Represents an artist that worked on a track
 * @see Track
 */
export interface Artist {
  readonly name: string;
  readonly [tag]: 'Artist';
}

/**
 * Contains functions for working with artists
 */
export namespace Artist {
  /**
   * Makes an artist object
   * @param name The artists name
   */
  export function make(name: string): Artist {
    return Object.freeze({ name } as Artist);
  }

  /**
   * Gets the name of an artist
   * @param artist The artist
   */
  export function nameOf(artist: Artist): string {
    if (Array.isArray(artist)) return artist.map((a) => a.name).join(', ');
    return artist.name;
  }
}
