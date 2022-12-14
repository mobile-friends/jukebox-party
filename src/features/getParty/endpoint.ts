import { NextApiRequest, NextApiResponse } from 'next';
import { tryQueryParam } from '@common/query';
import {
  sendInvalidQueryParamError,
  sendMissingQueryParamError,
  sendPartyNotFoundError,
} from '@common/errors';
import { PartyCode } from '@common/partyCode';
import { PartyDb } from '@common/partyDb';
import database from '../../../firebase.config';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { GetPartyResponse } from '@features/getParty/dto';

const ParamName = 'partyCode';

export async function handleGetPartyRequest(
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

  const party = await PartyDb.tryGetByCode(database, partyCode);
  if (PartyDb.isError(party)) {
    return sendPartyNotFoundError(res, partyCode);
  }

  sendSuccess(res, StatusCodes.CREATED, party);
}
