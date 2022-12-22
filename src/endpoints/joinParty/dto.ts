import {
  DtoError,
  NotImplementedError,
  PartyNotFoundError,
} from '@common/types/errors';
import { SuccessResult } from '@common/infrastructure/types';
import { Guid } from 'guid-typescript';

export interface JoinPartyBody {
  partyCode: string;
  guestName: string;
}

export interface JoinPartySuccess extends SuccessResult {
  userId: Guid
}

export type JoinPartyError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type JoinPartyResult = JoinPartySuccess | JoinPartyError;
