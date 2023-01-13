declare const tag: unique symbol;

/**
 * Represents an artist that worked on a track
 * @see Track
 */
export interface Artist {
  readonly name: string;
  readonly id: string;
  readonly genres: string[];
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
  export function make(name: string, id: string, genres: string[]): Artist {
    return Object.freeze({ name, id, genres } as Artist);
  }

  /**
   * Gets the name of an artist
   * @param artist The artist
   */
  export function nameOf(artist: Artist): string {
    if (Array.isArray(artist)) return artist.map((a) => a.name).join(', ');
    return artist.name;
  }

  /**
   * Gets the id of an artist
   * @param artist The artist
   */
  export function idOf(artist: Artist): string {
    return artist.id;
  }

  /**
   * Gets the genres of an artist
   * @param artist The artist
   */
  export function genresOf(artist: Artist): string[] {
    return artist.genres || [];
  }
}
