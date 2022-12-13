import { User } from '../lib/user';
import { Party } from '../lib/party';
import { PartyDb } from '../lib/partyDb';
import { FirebaseDatabase } from '@firebase/database-types';
import { PartyCode } from '@src/lib/partyCode';

export default async function tryCreateParty(
  partyName: string,
  hostName: string,
  database: FirebaseDatabase
): Promise<PartyCode> {
  const host = User.makeHost(hostName);
  const party = Party.startNew(partyName, host);

  await PartyDb.store(database, party);
  return party.code;
}
