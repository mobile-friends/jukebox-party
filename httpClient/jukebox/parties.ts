import { jukeboxClient } from '.';
import { Party } from '../../lib/party';
import { PartyJoinRequestBody } from '../../pages/api/parties/join';
import { ApiErrorResponse, isApiErrorResult } from '../../lib/apiError';

const BaseUrl = 'parties';

const createParty = async (
  partyName: string,
  hostName: string
): Promise<Party> => {
  const res = await jukeboxClient.post(`${BaseUrl}`, { partyName, hostName });
  // TODO: Handle error responses
  return res.data;
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
  const data: PartyJoinRequestBody = {
    partyCode,
    guestName,
  };
  const res = await jukeboxClient.post(JoinPartyUrl, data);
  const result = res.data as Object | ApiErrorResponse;
  return !isApiErrorResult(result);
}

export { createParty, sendJoinPartyRequest };
