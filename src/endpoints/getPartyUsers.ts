import { tryQueryParam } from '@common/util/query';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { DtoError, Ok, PartyNotFoundError } from '@common/infrastructure/types';
import { Party } from '@common/types/party';
import { Guest, Host } from '@common/types/user';

const PartyCodeQueryParamName = 'partyCode';

export type GetPartyError = DtoError | PartyNotFoundError;

export interface GetPartyUsersSuccess {
  host: Host;
  guests: Guest[];
}

export type GetPartyUsersResult = Ok<GetPartyUsersSuccess> | GetPartyError;

export default requestHandler<NoBody, GetPartyUsersResult>(async (req) => {
  const partyCodeParam = tryQueryParam(req.query, PartyCodeQueryParamName);
  if (partyCodeParam === null) {
    return Response.missingQueryParam(PartyCodeQueryParamName);
  }

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return Response.invalidQueryParam(PartyCodeQueryParamName);
  }

  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);
  if (PartyDb.isError(party)) {
    return Response.partyNotFound(partyCode);
  }

  return Response.ok<GetPartyUsersSuccess>({
    host: Party.hostOf(party),
    guests: Party.guestsOf(party),
  });
});
