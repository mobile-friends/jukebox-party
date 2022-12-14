import { DtoError, PartyNotFoundError } from '@common/errors';
import { ApiResponse } from '@common/apiResponse';
import { Party } from '@common/types/party';

export type GetPartyError = DtoError | PartyNotFoundError;

export type GetPartyResponse = ApiResponse<Party | GetPartyError>;
