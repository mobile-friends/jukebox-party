import { CreatePartyRequestDto, CreatePartyResponseDto } from './dto';
import { User } from '../lib/user';
import { Party } from '../lib/party';
import { PartyDb } from '../lib/partyDb';
import { FirebaseDatabase } from '@firebase/database-types';

export default async function tryCreateParty(
  request: CreatePartyRequestDto,
  database: FirebaseDatabase
): Promise<CreatePartyResponseDto> {
  const { partyName, hostName } = request;

  const host = User.makeHost(hostName);
  const party = Party.startNew(partyName, host);

  await PartyDb.store(database, party);
  return { partyCode: party.code };
}
