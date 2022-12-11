import { Party } from '../lib/party';
import { ApiErrorResponse } from '../lib/apiError';
import { PartyCode } from '../lib/partyCode';

export interface CreatePartyRequestDto {
  partyName: string;
  hostName: string;
}

export interface CreatePartyResponseDto {
  partyCode: PartyCode;
}
