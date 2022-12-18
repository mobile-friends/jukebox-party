import { DtoError, PartyNotFoundError } from '@common/types/errors';
import { Party } from '@common/types/party';
import { SuccessResult } from '@common/infrastructure/types';

export type GetPartyError = DtoError | PartyNotFoundError;

export interface GetPartySuccess extends SuccessResult {
  party: Party;
}

export type GetPartyResult = GetPartySuccess | GetPartyError;
