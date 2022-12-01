import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { User } from '../../../lib/user';
import { Party } from '../../../lib/party';
import { PartyDb } from '../../../lib/partyDb';

interface RequestBody {
  partyName: string;
  hostName: string;
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
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  // TODO: Check if body is well-formed
  const { partyName, hostName } = req.body as RequestBody;

  const host = User.makeHost(hostName);
  const party = Party.startNew(partyName, host);

  await PartyDb.store(database, party);
  res.status(201).json(party);
}
