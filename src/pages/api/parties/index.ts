import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../firebase.config';
import { User } from '@src/lib/user';
import { Party } from '@src/lib/party';
import { PartyDb } from '@src/lib/partyDb';
import {
  ApiErrorResponse,
  methodNotAllowed,
  sendError,
} from '@src/lib/apiError';
import { CreatePartyRequestDto } from '@src/createParty/dto';
import tryCreateParty from '../../../createParty/server';

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Check if body is well-formed
  const request = req.body as CreatePartyRequestDto;
  const response = await tryCreateParty(request, database);
  res.status(201).json(response);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      return await handlePost(req, res);
    default:
      return sendError(req, res, methodNotAllowed(['POST']));
  }
}
