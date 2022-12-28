import { jukeboxClient } from './index';
import {
  CreatePartyBody,
  CreatePartyResult,
  CreatePartySuccess,
} from '@endpoint/createParty/dto';
import { JoinPartyBody, JoinPartyResult } from '@endpoint/joinParty/dto';
import { isSuccess } from '@common/infrastructure/response';
import { Track } from '@common/types/track';
import { GetPartyTrackResult } from '@endpoint/getPartyTrack/dto';
import { PartyCode } from '@common/types/partyCode';

export async function createParty(
  partyName: string,
  hostName: string,
  spotifyToken: string
): Promise<CreatePartySuccess> {
  const response = await jukeboxClient.post<CreatePartyBody, CreatePartyResult>(
    `parties`,
    { partyName, hostName, spotifyToken }
  );
  return response.data;
}

export async function sendJoinPartyRequest(
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

export async function getCurrentTrack(
  partyCode: PartyCode
): Promise<Track | null> {
  const url = `parties/${partyCode}/track`;
  const response = await jukeboxClient.get<GetPartyTrackResult>(url);
  if (isSuccess(response)) {
    return response.data.track;
  } else {
    console.error(response); // TODO: Handle errors
    return null;
  }
}
