import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { addGuestTo } from '../../../lib/Party';
import { makeGuest } from '../../../lib/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { partyCode, guestName } = req.body;

  console.log(partyCode);
  console.log(guestName);

  await database
    .ref(`parties/${partyCode}/`)
    .set(addGuestTo(partyCode, makeGuest(guestName)));

  res.status(201).json({ partyCode });
}
