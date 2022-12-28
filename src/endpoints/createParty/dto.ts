import { PartyCode } from '@common/types/partyCode';
import { SuccessResult } from '@common/infrastructure/types';

export interface CreatePartyBody {
  partyName: string;
  hostName: string;
  spotifyToken: string;
}

export interface CreatePartySuccess extends SuccessResult {
  partyCode: PartyCode;
  hostId: string;
}

export type CreatePartyResult = CreatePartySuccess;
