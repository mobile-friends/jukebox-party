import { Artist } from './Artist';

export interface Track {
  name: string;
  artists: Artist[];
}

export namespace Track {

  export function make(name: string, artists: Artist[]): Track {
    return { name, artists };
  }

  export function nameOf(track: Track): string {
    return track.name;
  }

  export function artistsOf(track: Track): Artist[] {
    return track.artists;
  }
}
