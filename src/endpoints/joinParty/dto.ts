import {
  DtoError,
  NotImplementedError,
  PartyNotFoundError,
} from '@common/types/errors';
import { SuccessResult } from '@common/infrastructure/types';

export interface JoinPartyBody {
  partyCode: string;
  guestName: string;
}

export interface JoinPartySuccess extends SuccessResult {}

export type JoinPartyError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type JoinPartyResult = JoinPartySuccess | JoinPartyError;
