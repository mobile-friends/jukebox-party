import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { getPartyDetails } from '../../../httpClient/jukebox/parties';
import { Party } from '../../../lib/party';
import { User } from '../../../lib/user';

interface RequestBody {
  partyCode: string;
  guestName: string;
}

// Join a Party with the Party-ID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { partyCode, guestName }: RequestBody = req.body;

  //Get the Party Objekt by ID
  const party = await getPartyDetails(partyCode);
  const guest = User.makeGuest(guestName);
  const partyWithGuest = Party.addGuestTo(party, guest);

  await database.ref(`parties/${partyCode}/`).set(partyWithGuest);

  res.status(200).json({ party: partyWithGuest });
}
