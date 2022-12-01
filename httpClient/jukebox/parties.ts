import { jukeboxClient } from '.';
import { Party } from '../../lib/party';
import { PartyJoinRequestBody } from '../../pages/api/parties/join';

const BaseUrl = 'parties';

const createParty = async (partyName: string, hostName: string) => {
  const res = await jukeboxClient.post(`${BaseUrl}`, { partyName, hostName });
  console.log('res', res);
  return res.data;
};

const JoinPartyUrl = `${BaseUrl}/join`;

async function sendJoinPartyRequest(
  partyCode: string,
  guestName: string
): Promise<void> {
  guestName = encodeURIComponent(guestName);
  const data: PartyJoinRequestBody = {
    partyCode,
    guestName,
  };
  await jukeboxClient.post(JoinPartyUrl, data);
}

export { createParty, sendJoinPartyRequest };
