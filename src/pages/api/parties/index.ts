import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../firebase.config';
import { methodNotAllowed, sendError } from '@src/lib/apiError';
import {
  CreatePartyRequestDto,
  CreatePartyResponseDto,
} from '@src/createParty/dto';
import tryCreateParty from '../../../createParty/server';

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Check if body is well-formed
  const request = req.body as CreatePartyRequestDto;
  const { partyName, hostName } = request;

  const partyCode = await tryCreateParty(partyName, hostName, database);

  const response: CreatePartyResponseDto = { partyCode };
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
