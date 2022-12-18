import { PartyCode } from '@common/types/partyCode';
import { SuccessResult } from '@common/infrastructure/types';

export interface CreatePartyBody {
  partyName: string;
  hostName: string;
}

export interface CreatePartySuccess extends SuccessResult {
  partyCode: PartyCode;
}

export type CreatePartyResult = CreatePartySuccess;
