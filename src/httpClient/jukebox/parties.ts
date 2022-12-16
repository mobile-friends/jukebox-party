import { jukeboxClient } from './index';
import { isSuccessResponse } from '@common/apiResponse';
import { CreatePartyDto, CreatePartyResponse } from '@endpoint/createParty/dto';
import { PartyCode } from '@common/types/partyCode';
import { JoinPartyDto, JoinPartyResponse } from '@endpoint/joinParty/dto';

const BaseUrl = 'parties';

const createParty = async (
  partyName: string,
  hostName: string
): Promise<PartyCode> => {
  const response = await jukeboxClient.post<
    CreatePartyDto,
    CreatePartyResponse
  >(`${BaseUrl}`, { partyName, hostName });
  return response.partyCode;
};

const JoinPartyUrl = `${BaseUrl}/join`;

/**
 * Sends a join-request for a guest to the server.
 * Returns true if everything worked out
 * @param partyCode The code of the party to join
 * @param guestName The name of the guest
 */
async function sendJoinPartyRequest(
  partyCode: string,
  guestName: string
): Promise<boolean> {
  guestName = encodeURIComponent(guestName);
  const response = await jukeboxClient.post<JoinPartyDto, JoinPartyResponse>(
    JoinPartyUrl,
    {
      partyCode,
      guestName,
    }
  );
  return isSuccessResponse(response);
}

export { createParty, sendJoinPartyRequest };
