import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { requestHandler } from '@common/infrastructure/requestHandler';
import {
  DtoError,
  NotImplementedError,
  Ok,
  PartyNotFoundError,
} from '@common/infrastructure/types';
import { History } from '@common/types/history';
import { Track } from '@common/types/track';
import { tryQueryParam } from '@common/util/query';
import { Response } from '@common/infrastructure/response';
import { Party } from '@common/types/party';

export interface GetHistoryBody {
  track: Track;
}

export interface GetHistorySuccess {
  history: History;
}

export type GetHistoryError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type GetHistoryResult = Ok<GetHistorySuccess> | GetHistoryError;

const PartyCodeQueryParamName = 'partyCode';

export default requestHandler<GetHistoryBody, GetHistoryResult>(async (req) => {
  const { track } = req.body;

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

  const history = Party.historyOf(party);
  return Response.ok<GetHistorySuccess>({ history: history });
});
