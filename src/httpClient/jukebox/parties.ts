import { jukeboxClient } from './index';
import { JoinPartyDto, JoinPartyResponse } from '@src/pages/api/parties/join';
import { isSuccessResponse } from '@src/common/apiResponse';
import { CreatePartyResponse } from '@src/createParty/dto';
import { PartyCode } from '@src/lib/partyCode';

const BaseUrl = 'parties';

const createParty = async (
  partyName: string,
  hostName: string
): Promise<PartyCode> => {
  const res = await jukeboxClient.post(`${BaseUrl}`, { partyName, hostName });
  const response = res.data as CreatePartyResponse;
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
  const data: JoinPartyDto = {
    partyCode,
    guestName,
  };
  const res = await jukeboxClient.post(JoinPartyUrl, data);
  const response = res.data as JoinPartyResponse;
  return isSuccessResponse(response);
}

export { createParty, sendJoinPartyRequest };
