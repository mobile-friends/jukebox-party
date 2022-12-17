import { ApiResponse, EmptyDto } from '@common/apiResponse';

export interface JoinPartyDto {
  partyCode: string;
  guestName: string;
}

export type PartyJoinedDto = EmptyDto;

export type JoinPartyResponse = ApiResponse<PartyJoinedDto>;
