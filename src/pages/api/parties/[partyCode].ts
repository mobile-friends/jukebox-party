import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../firebase.config';
import { PartyCode } from '@src/lib/partyCode';
import { tryQueryParam } from '@src/lib/query';
import { PartyDb } from '@src/lib/partyDb';
import { Party } from '@src/lib/party';
import { multiMethodHandler } from '@src/common/apiUtil';
import HTTPMethod from 'http-method-enum';
import {
  PartyNotFoundError,
  DtoError,
  sendInvalidQueryParamError,
  sendMissingQueryParamError,
  sendPartyNotFoundError,
} from '@src/common/errors';
import { ApiResponse, sendSuccess } from '@src/common/apiResponse';
import { StatusCodes } from 'http-status-codes';

const ParamName = 'partyCode';

export type GetPartyError = DtoError | PartyNotFoundError;

export type GetPartyResponse = ApiResponse<Party, GetPartyError>;

async function handleGet(
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

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGet,
});
