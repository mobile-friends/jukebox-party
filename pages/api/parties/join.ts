import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { Party } from '../../../lib/party';
import { User } from '../../../lib/user';
import { PartyCode } from '../../../lib/partyCode';
import { PartyDb } from '../../../lib/partyDb';
import {
  invalidPartyCode,
  methodNotAllowed,
  sendError,
} from '../../../lib/apiError';

export interface PartyJoinRequestBody {
  partyCode: string;
  guestName: string;
}

/**
 * Join a party using its party-code
 * @param req The request
 * @param res The response
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return sendError(req, res, methodNotAllowed(['POST']));
  }

  const { partyCode: partyCodeParam, guestName } =
    req.body as PartyJoinRequestBody;

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return sendError(req, res, invalidPartyCode(partyCodeParam, 'partyCode'));
  }

  const result = await PartyDb.tryGetByCode(database, partyCode);
  if (PartyDb.isError(result)) {
    switch (result.kind) {
      case PartyDb.ErrorType.PartyNotFound:
        res.status(404).json({ message: 'Party not found' });
        return;
      case PartyDb.ErrorType.InvalidEntry:
        res.status(500).json({ message: 'Internal db error' });
        return;
    }
  }

  const guest = User.makeGuest(guestName);
  const partyWithGuest = Party.addGuestTo(result, guest);

  await PartyDb.store(database, partyWithGuest);
  res.status(200).json(partyWithGuest);
}
