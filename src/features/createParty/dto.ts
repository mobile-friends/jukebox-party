import { PartyCode } from '@common/partyCode';
import { ApiResponse } from '@common/apiResponse';

export interface CreatePartyDto {
  partyName: string;
  hostName: string;
}

export interface PartyCreatedDto {
  partyCode: PartyCode;
}

export type CreatePartyError = never;

export type CreatePartyResponse = ApiResponse<
  PartyCreatedDto | CreatePartyError
>;
