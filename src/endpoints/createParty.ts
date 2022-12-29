import { User } from '@common/types/user';
import { Party } from '@common/types/party';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { SpotifyToken } from '@common/types/global';
import { SuccessResult } from '@common/infrastructure/types';
import { PartyCode } from '@common/types/partyCode';

export interface CreatePartyBody {
  partyName: string;
  hostName: string;
  spotifyToken: SpotifyToken;
}

export interface CreatePartySuccess extends SuccessResult {
  partyCode: PartyCode;
  hostId: string;
}

export type CreatePartyResult = CreatePartySuccess;

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
