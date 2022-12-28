import { User } from '@common/types/user';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import { CreatePartyBody, CreatePartyResult } from '../createParty/dto';
import firebaseDb from '@common/firebaseDb';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';

export default requestHandler<CreatePartyBody, CreatePartyResult>(
  async (req) => {
    const { partyName, hostName, spotifyToken } = req.body;
    const host = User.makeHost(hostName);
    const party = Party.startNew(partyName, spotifyToken, host);

    await PartyDb.store(firebaseDb, party);
    return Respond.withCreated({
      partyCode: Party.codeOf(party),
      hostId: User.idOf(host),
    });
  }
);
