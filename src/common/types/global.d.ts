import { PartyCode } from '@common/types/partyCode';

declare global {
  enum SkipDirection {
    Forward,
    Backward,
  }

  type SpotifyToken = string & { _tag: 'SpotifyToken' };

  type UserId = string; // TODO: Make branded type

  interface PartyCredentials {
    partyCode: PartyCode;
    userId: UserId;
  }
}
