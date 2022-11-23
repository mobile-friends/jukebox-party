import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { getPartyDetails } from '../../../httpClient/jukebox/parties';
import { addGuestTo } from '../../../lib/Party';
import { makeGuest } from '../../../lib/User';

// Join a Party with the Party-ID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { partyCode, guestName } = req.body;

  //Get the Party Objekt by ID
  const party = await getPartyDetails(partyCode);

  await database
    .ref(`parties/${party.code}/`)
    .set(addGuestTo(party, guestName));

  //not working because of enum type
  /* await database
    .ref(`parties/${party.code}/`)
    .set(addGuestTo(party, makeGuest(guestName)));
  */

  res.status(200).json({ party });
}
