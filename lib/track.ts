import { Artist } from './artist';
import { Duration } from './duration';

export interface Track {
  name: string;
  duration: Duration;
  artists: Artist[];
}

export namespace Track {
  export function make(
    name: string,
    duration: Duration,
    artists: Artist[]
  ): Track {
    return { name, duration, artists };
  }

  export function nameOf(track: Track): string {
    return track.name;
  }

  export function artistsOf(track: Track): Artist[] {
    return track.artists;
  }

  export function durationOf(track: Track): Duration {
    return track.duration;
  }
}
