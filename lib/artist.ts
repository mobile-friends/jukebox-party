/**
 * Represents an artist that worked on a track
 * @see Track
 */
export interface Artist {
  /**
   * The artists name
   */
  name: string;
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
    return { name };
  }

  /**
   * Gets the name of an artist
   * @param artist The artist
   */
  export function nameOf(artist: Artist): string {
    return artist.name;
  }
}
