import { ApiResponse } from '@src/common/apiResponse';

export interface JoinPartyDto {
  partyCode: string;
  guestName: string;
}

export type PartyJoinedDto = {};

export type JoinPartyError = never;

export type JoinPartyResponse = ApiResponse<PartyJoinedDto, JoinPartyError>;
