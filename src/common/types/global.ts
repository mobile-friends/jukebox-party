export enum SkipDirection {
  Forward,
  Backward,
}

export type SpotifyToken = string & { _tag: 'SpotifyToken' };
