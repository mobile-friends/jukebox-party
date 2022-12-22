import { PartyCode } from '@common/types/partyCode';
import { SuccessResult } from '@common/infrastructure/types';
import { Guid } from 'guid-typescript';

export interface CreatePartyBody {
  partyName: string;
  hostName: string;
}

export interface CreatePartySuccess extends SuccessResult {
  partyCode: PartyCode;
  hostId: Guid;
}

export type CreatePartyResult = CreatePartySuccess;
