import { User } from '@common/types/user';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { Created } from '@common/infrastructure/types';
import { SpotifyAuthData } from '@common/types/spotifyAuthData';

export interface CreatePartyBody {
  partyName: string;
  hostName: string;
  spotifyAuthData: SpotifyAuthData;
}

export type CreatePartyResult = Created<PartyCredentials>;

export default requestHandler<CreatePartyBody, CreatePartyResult>(
  async (req) => {
    const { partyName, hostName, spotifyAuthData } = req.body;
    const host = User.makeHost(hostName);
    const party = Party.startNew(partyName, host, spotifyAuthData);
    await PartyDb.store(firebaseDb, party);
    return Response.created<PartyCredentials>({
      partyCode: Party.codeOf(party),
      userId: User.idOf(host),
    });
  }
);
