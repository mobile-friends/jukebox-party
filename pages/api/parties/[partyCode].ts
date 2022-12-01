import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { PartyCode } from '../../../lib/partyCode';
import { tryQueryParam } from '../../../utils/query';
import { PartyDb } from '../../../lib/partyDb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const partyCodeParam = tryQueryParam(req, 'partyCode');
  if (partyCodeParam === null) {
    res.status(400).json({ message: 'Missing party-code param' });
    return;
  }

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    res.status(400).json({ message: 'Party-code param not valid' });
    return;
  }

  const party = await PartyDb.tryGetByCode(database, partyCode);
  if (party === null) {
    res.status(404).json({ message: 'Party not found' });
    return;
  }

  res.status(200).json(party);
}
