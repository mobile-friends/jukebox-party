import { PartyCode } from '../lib/partyCode';
import { ApiResponse } from '@src/common/apiResponse';

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
