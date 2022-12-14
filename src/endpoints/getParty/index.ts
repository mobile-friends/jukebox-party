import { NextApiRequest, NextApiResponse } from 'next';
import { tryQueryParam } from '@common/util/query';
import {
  sendInvalidQueryParamError,
  sendMissingQueryParamError,
  sendPartyNotFoundError,
} from '@common/errors';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { GetPartyResponse } from '../getParty/dto';

const ParamName = 'partyCode';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<GetPartyResponse>
) {
  const partyCodeParam = tryQueryParam(req.query, ParamName);
  if (partyCodeParam === null) {
    return sendMissingQueryParamError(res, ParamName);
  }

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return sendInvalidQueryParamError(res, ParamName);
  }

  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);
  if (PartyDb.isError(party)) {
    return sendPartyNotFoundError(res, partyCode);
  }

  sendSuccess(res, StatusCodes.CREATED, party);
}
