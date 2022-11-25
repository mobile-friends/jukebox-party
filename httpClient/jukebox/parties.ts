import { jukeboxClient } from '.';
import { Party } from '../../lib/party';

const baseURL = 'parties';

const createParty = async (partyName: string, hostName: string) => {
  const res = await jukeboxClient.post(`${baseURL}`, { partyName, hostName });
  return res.data;
};

const getPartyDetails = async (partyCode: string): Promise<Party> => {
  try {
    const res = await jukeboxClient.get(`${baseURL}/${partyCode}`);
    console.log('res', res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getPartyString = (partyCode: string) => {
  return `${baseURL}/${partyCode}`;
};

const joinParty = async (partyCode: string, guestName: string) => {
  const res = await jukeboxClient.post(`${baseURL}/join`, {
    partyCode,
    guestName,
  });
  return res.data;
};

export { createParty, getPartyDetails, joinParty, getPartyString };
