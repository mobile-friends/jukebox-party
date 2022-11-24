import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { makeNewParty } from '../../../lib/Party';
import { makeHost } from '../../../lib/User';
import doesPartyExist from '../../../utils/parties';
import createPartyCode from '../../../utils/partyCodes';

// Gets the data of a party by its roomcode
// ? ONLY ONCE
//TODO irgendwie diesen Snapshot returnen um changes zu verfolgen
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { partyCode } = req.query;

  const dbRef = database.ref(`parties/${partyCode}`);
  const exists: boolean = await doesPartyExist(dbRef);
  if (!exists) {
    res.status(404).json({ message: 'Party not found' });
    return;
  }
  await dbRef.once('value', (snapshot) => {
    const party = snapshot.val();
    res.status(200).json(party);
  });
}
