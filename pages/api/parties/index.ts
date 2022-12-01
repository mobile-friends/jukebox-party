import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { User } from '../../../lib/user';
import { Party } from '../../../lib/party';
import { PartyCode } from '../../../lib/partyCode';

interface RequestBody {
  partyName: string,
  hostName: string
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

  const { partyName, hostName } = req.body as RequestBody;
  const partyCode = PartyCode.generate();
  const host = User.makeHost(hostName);
  const party = Party.startNew(partyCode, partyName, host);

  await database.ref(`parties/${partyCode}/`).set(party);
  res.status(201).json(party);
}
