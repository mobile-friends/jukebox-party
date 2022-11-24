import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { makeNewParty } from '../../../lib/Party';
import { makeHost } from '../../../lib/User';
import createPartyCode from '../../../utils/partyCodes';

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

  await database
    .ref(`parties/${partyCode}/`)
    .set(makeNewParty(partyName, partyCode, makeHost(hostName)));

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
