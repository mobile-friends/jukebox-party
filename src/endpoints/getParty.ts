import { tryQueryParam } from '@common/util/query';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { DtoError, Ok, PartyNotFoundError } from '@common/infrastructure/types';
import { Party } from '@common/types/party';

const ParamName = 'partyCode';

export type GetPartyError = DtoError | PartyNotFoundError;

export interface GetPartySuccess {
  party: Party;
}

export type GetPartyResult = Ok<GetPartySuccess> | GetPartyError;

export default requestHandler<NoBody, GetPartyResult>(async (req) => {
  const partyCodeParam = tryQueryParam(req.query, ParamName);
  if (partyCodeParam === null) {
    return Response.missingQueryParam(ParamName);
  }

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return Response.invalidQueryParam(ParamName);
  }

  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);
  if (PartyDb.isError(party)) {
    return Response.partyNotFound(partyCode);
  }

  return Response.ok<GetPartySuccess>({ party });
});
