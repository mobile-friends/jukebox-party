import { PartyCode } from '@common/types/partyCode';

export enum SkipDirection {
  Forward,
  Backward,
}

export type SpotifyToken = string & { _tag: 'SpotifyToken' };

export type UserId = string; // TODO: Make branded type

export interface PartyCredentials {
  partyCode: PartyCode;
  userId: UserId;
}
