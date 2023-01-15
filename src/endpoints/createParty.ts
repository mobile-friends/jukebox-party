import { User } from '@common/types/user';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { Created } from '@common/infrastructure/types';

export interface CreatePartyBody {
  partyName: string;
  hostName: string;
  spotifyToken: SpotifyToken;
  refreshToken: SpotifyRefreshToken;
}

export type CreatePartyResult = Created<PartyCredentials>;

export default requestHandler<CreatePartyBody, CreatePartyResult>(
  async (req) => {
    const { partyName, hostName, spotifyToken, refreshToken } = req.body;
    const host = User.makeHost(hostName);
    const party = Party.startNew(partyName, spotifyToken, refreshToken, host);
console.log(party)
    await PartyDb.store(firebaseDb, party);
    return Response.created<PartyCredentials>({
      partyCode: Party.codeOf(party),
      userId: User.idOf(host),
    });
  }
);
