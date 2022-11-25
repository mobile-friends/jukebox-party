import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import createPartyCode from '../../../utils/partyCodes';
import { User } from '../../../lib/user';
import { Party } from '../../../lib/party';

// Creates a new Party by adding a new collection with a randomly generated roomcode as its ID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = createPartyCode();
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { partyName, hostName } = req.body;

  const host: User = User.makeHost(hostName);
  const party: Party = Party.startNew(code, partyName, host);
  await database.ref(`parties/${code}/`).set(party);

  res.status(201).json(party);
}
