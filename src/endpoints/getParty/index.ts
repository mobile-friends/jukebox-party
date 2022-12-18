import { tryQueryParam } from '@common/util/query';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { GetPartyResult } from '../getParty/dto';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';

const ParamName = 'partyCode';

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
