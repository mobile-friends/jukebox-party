import { PartyCode } from '@common/types/partyCode';
import { SuccessResult } from '@common/infrastructure/types';
import { SpotifyToken } from '@common/types/global';

export interface CreatePartyBody {
  partyName: string;
  hostName: string;
  spotifyToken: SpotifyToken;
}

export interface CreatePartySuccess extends SuccessResult {
  partyCode: PartyCode;
  hostId: string;
}

export type CreatePartyResult = CreatePartySuccess;
