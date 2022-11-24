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
  const partyCode = createPartyCode();
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { partyName, hostName } = req.body;

  const host = User.makeHost(hostName);
  const party = Party.startNew(partyCode, partyName, host);
  await database.ref(`parties/${partyCode}/`).set(party);

  // Mit dem Objekt geht es, mit dem Enum vom Ramon leider noch nicht
  /*
    {
    code: partyCode,
    name: partyName,
    host: {
      name: hostName,
    },
  }
  */

  res.status(201).json({ partyCode });
}
