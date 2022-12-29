import { tryQueryParam } from '@common/util/query';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { DtoError, PartyNotFoundError } from '@common/infrastructure/errors';
import { SuccessResult } from '@common/infrastructure/types';
import { Party } from '@common/types/party';

const ParamName = 'partyCode';

export type GetPartyError = DtoError | PartyNotFoundError;

export interface GetPartySuccess extends SuccessResult {
  party: Party;
}

export type GetPartyResult = GetPartySuccess | GetPartyError;

export default requestHandler<NoBody, GetPartyResult>(async (req) => {
  const partyCodeParam = tryQueryParam(req.query, ParamName);
  if (partyCodeParam === null) {
    return Respond.withMissingQueryParamError(ParamName);
  }

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return Respond.withInvalidQueryParamError(ParamName);
  }

  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);
  if (PartyDb.isError(party)) {
    return Respond.withPartyNotFoundError(partyCode);
  }

  return Respond.withOk({ party });
});
