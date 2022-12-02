import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../firebase.config';
import { PartyCode } from '../../../lib/partyCode';
import { tryQueryParam } from '../../../lib/query';
import { PartyDb } from '../../../lib/partyDb';
import { methodNotAllowed, sendError } from '../../../lib/apiError';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return sendError(req, res, methodNotAllowed(['GET']));
  }

  const partyCodeParam = tryQueryParam(req.query, 'partyCode');
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
