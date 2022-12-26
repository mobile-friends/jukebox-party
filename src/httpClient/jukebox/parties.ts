import { jukeboxClient } from './index';
import { CreatePartyBody, CreatePartyResult } from '@endpoint/createParty/dto';
import { PartyCode } from '@common/types/partyCode';
import { JoinPartyBody, JoinPartyResult } from '@endpoint/joinParty/dto';
import { isSuccess } from '@common/infrastructure/response';

const createParty = async (
  partyName: string,
  hostName: string,
  spotifyToken: string
): Promise<PartyCode> => {
  const response = await jukeboxClient.post<CreatePartyBody, CreatePartyResult>(
    `parties`,
    { partyName, hostName, spotifyToken }
  );
  return response.data.partyCode;
};

async function sendJoinPartyRequest(
  partyCode: string,
  guestName: string
): Promise<boolean> {
  guestName = encodeURIComponent(guestName);
  const response = await jukeboxClient.post<JoinPartyBody, JoinPartyResult>(
    'parties/join',
    {
      partyCode,
      guestName,
    }
  );
  return isSuccess(response);
}

export { createParty, sendJoinPartyRequest };
