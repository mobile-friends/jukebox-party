import { User } from '@common/types/user';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import { FirebaseDatabase } from '@firebase/database-types';
import { PartyCode } from '@common/types/partyCode';
import { CreatePartyBody, CreatePartySuccess } from '../createParty/dto';
import firebaseDb from '@common/firebaseDb';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';

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

export default requestHandler<CreatePartyBody, CreatePartySuccess>(
  async (req) => {
    const { partyName, hostName } = req.body;
    const partyCode = await tryCreateParty(partyName, hostName, firebaseDb);
    return Respond.withCreated({
      partyCode,
    });
  }
);
