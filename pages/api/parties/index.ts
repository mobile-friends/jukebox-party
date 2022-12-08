import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { User } from '../../../lib/user';
import { Party } from '../../../lib/party';
import { PartyDb } from '../../../lib/partyDb';
import { methodNotAllowed, sendError } from '../../../lib/apiError';

interface RequestBody {
  partyName: string;
  hostName: string;
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Check if body is well-formed
  const { partyName, hostName } = req.body as RequestBody;

  const host = User.makeHost(hostName);
  const party = Party.startNew(partyName, host);

  await PartyDb.store(database, party);
  res.status(201).json(party);
}

/**
 * Creates a new Party by adding a new collection with a randomly generated room-code as its ID
 * @param req The request
 * @param res The response
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return await handlePost(req, res);
  }

  return sendError(req, res, methodNotAllowed(['POST']));
}
