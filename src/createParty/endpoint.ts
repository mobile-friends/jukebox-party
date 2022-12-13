import { User } from '../lib/user';
import { Party } from '../lib/party';
import { PartyDb } from '../lib/partyDb';
import { FirebaseDatabase } from '@firebase/database-types';
import { PartyCode } from '@src/lib/partyCode';
import { NextApiRequest, NextApiResponse } from 'next';
import { CreatePartyDto, CreatePartyResponse } from '@src/createParty/dto';
import database from '../../firebase.config';
import { sendSuccess } from '@src/common/apiResponse';
import { StatusCodes } from 'http-status-codes';

export async function tryCreateParty(
  partyName: string,
  hostName: string,
  database: FirebaseDatabase
): Promise<PartyCode> {
  const host = User.makeHost(hostName);
  const party = Party.startNew(partyName, host);

  await PartyDb.store(database, party);
  return party.code;
}

export async function handleCreatePartyRequest(
  req: NextApiRequest,
  res: NextApiResponse<CreatePartyResponse>
) {
  // TODO: Check if body is well-formed
  const request = req.body as CreatePartyDto;
  const { partyName, hostName } = request;

  const partyCode = await tryCreateParty(partyName, hostName, database);

  sendSuccess(res, StatusCodes.CREATED, {
    partyCode,
  });
}
