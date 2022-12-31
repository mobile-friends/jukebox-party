import { PartyCode } from '@common/types/partyCode';

declare global {
  type SpotifyToken = string & { _tag: 'SpotifyToken' };

  type UserId = string; // TODO: Make branded type

  interface PartyCredentials {
    partyCode: PartyCode;
    userId: UserId;
  }

  type ErrorMessage = string;

  type SyncOrAsync<T> = T | Promise<T>;
}
