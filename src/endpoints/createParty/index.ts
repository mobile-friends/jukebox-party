import { User } from '@common/types/user';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import { FirebaseDatabase } from '@firebase/database-types';
import { PartyCode } from '@common/types/partyCode';
import { NextApiRequest, NextApiResponse } from 'next';
import { CreatePartyDto, CreatePartyResponse } from '../createParty/dto';
import firebaseDb from '@common/firebaseDb';
import { sendSuccess } from '@common/apiResponse';
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

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<CreatePartyResponse>
) {
  // TODO: Check if body is well-formed
  const request = req.body as CreatePartyDto;
  const { partyName, hostName } = request;

  const partyCode = await tryCreateParty(partyName, hostName, firebaseDb);

  sendSuccess(res, StatusCodes.CREATED, {
    partyCode,
  });
}
