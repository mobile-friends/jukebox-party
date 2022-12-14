import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../firebase.config';
import { PartyCode } from '@common/partyCode';
import { tryQueryParam } from '@common/query';
import { PartyDb } from '@common/partyDb';
import { Party } from '@common/party';
import { multiMethodHandler } from '@src/common/apiUtil';
import HTTPMethod from 'http-method-enum';
import {
  DtoError,
  PartyNotFoundError,
  sendInvalidQueryParamError,
  sendMissingQueryParamError,
  sendPartyNotFoundError,
} from '@src/common/errors';
import { ApiResponse, sendSuccess } from '@src/common/apiResponse';
import { StatusCodes } from 'http-status-codes';

const ParamName = 'partyCode';

export type GetPartyError = DtoError | PartyNotFoundError;

export type GetPartyResponse = ApiResponse<Party | GetPartyError>;

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
