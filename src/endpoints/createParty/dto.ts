import { PartyCode } from '@common/types/partyCode';
import { ApiResponse } from '@common/apiResponse';

export interface CreatePartyDto {
  partyName: string;
  hostName: string;
}

export interface PartyCreatedDto {
  partyCode: PartyCode;
}

export type CreatePartyResponse = ApiResponse<PartyCreatedDto>;
