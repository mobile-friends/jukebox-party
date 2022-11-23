import { jukeboxClient } from '.';

const baseURL = 'parties';

const createParty = async (partyName: string, hostName: string) => {
  const res = await jukeboxClient.post(`${baseURL}`, { partyName, hostName });
  return res.data;
};

const getPartyDetails = async (partyCode: string) => {
  const res = await jukeboxClient.get(`${baseURL}/${partyCode}`);
  console.log(res.data);
  return res.data;
};

const joinParty = async (partyCode: string, guestName: string) => {
  const res = await jukeboxClient.post(`${baseURL}/join`, {
    partyCode,
    guestName,
  });
  console.log(res.data);
  return res.data;
};

export { createParty, getPartyDetails, joinParty };
