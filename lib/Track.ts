export interface Track {
  name: string;
}

export function makeTrack(name: string): Track {
  return { name };
}

export function nameOf(track: Track): string {
  return track.name;
}
