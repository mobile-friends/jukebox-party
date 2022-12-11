import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../firebase.config';
import { Party } from '../../../lib/party';
import { User } from '../../../lib/user';
import { PartyCode } from '../../../lib/partyCode';
import { PartyDb } from '../../../lib/partyDb';
import {
  ApiErrorResponse,
  internalError,
  invalidPartyCode,
  methodNotAllowed,
  partyNotFound,
  sendError,
} from '../../../lib/apiError';

export interface PostRequestBody {
  partyCode: string;
  guestName: string;
}

export type PostResponseBody = {} | ApiErrorResponse;

export type ResponseBody = PostResponseBody | ApiErrorResponse;

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseBody>
) {
  const { partyCode: partyCodeParam, guestName } = req.body as PostRequestBody;

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return sendError(req, res, invalidPartyCode(partyCodeParam, 'partyCode'));
  }

  const result = await PartyDb.tryGetByCode(database, partyCode);
  if (PartyDb.isError(result)) {
    switch (result.kind) {
      case PartyDb.ErrorType.PartyNotFound:
        return sendError(req, res, partyNotFound(partyCode));
      case PartyDb.ErrorType.InvalidEntry:
        return sendError(req, res, internalError('Internal db error'));
    }
  }

  const guest = User.makeGuest(guestName);
  const partyWithGuest = Party.addGuestTo(result, guest);

  await PartyDb.store(database, partyWithGuest);
  res.status(201).json({});
}

/**
 * Join a party using its party-code
 * @param req The request
 * @param res The response
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (req.method === 'POST') {
    return await handlePost(req, res);
  }
  return sendError(req, res, methodNotAllowed(['POST']));
}
