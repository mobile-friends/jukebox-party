import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../firebase.config';
import { PartyCode } from '@src/lib/partyCode';
import { tryQueryParam } from '@src/lib/query';
import { PartyDb } from '@src/lib/partyDb';
import {
  ApiErrorResponse,
  invalidPartyCode,
  methodNotAllowed,
  missingParam,
  partyNotFound,
  sendError,
} from '@src/lib/apiError';
import { Party } from '@src/lib/party';

const ParamName = 'partyCode';

export type GetResponseBody = Party | PartyDb.Error | ApiErrorResponse;

export type ResponseBody = GetResponseBody | ApiErrorResponse;

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseBody>
) {
  const partyCodeParam = tryQueryParam(req.query, ParamName);
  if (partyCodeParam === null) {
    return sendError(req, res, missingParam(ParamName));
  }

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return sendError(req, res, invalidPartyCode(partyCodeParam, ParamName));
  }

  const party = await PartyDb.tryGetByCode(database, partyCode);
  if (party === null) {
    return sendError(req, res, partyNotFound(partyCode));
  }

  res.status(200).json(party);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (req.method === 'GET') {
    return await handleGet(req, res);
  }

  return sendError(req, res, methodNotAllowed(['GET']));
}
