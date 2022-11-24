export interface Artist {
  name: string;
}

export namespace Artist {
  export function make(name: string): Artist {
    return { name };
  }

  export function nameOf(artist: Artist): string {
    return artist.name;
  }
}
