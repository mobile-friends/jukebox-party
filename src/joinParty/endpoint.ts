import { NextApiRequest, NextApiResponse } from 'next';
import { JoinPartyDto, JoinPartyResponse } from '@src/joinParty/dto';
import { PartyCode } from '@common/partyCode';
import {
  sendGenericServerError,
  sendInvalidBodyError,
  sendPartyNotFoundError,
} from '@src/common/errors';
import { PartyDb } from '@common/partyDb';
import database from '../../firebase.config';
import { User } from '@common/user';
import { Party } from '@common/party';
import { sendSuccess } from '@src/common/apiResponse';
import { StatusCodes } from 'http-status-codes';

export async function handleJoinPartyRequest(
  req: NextApiRequest,
  res: NextApiResponse<JoinPartyResponse>
) {
  const request = req.body as JoinPartyDto;
  const { partyCode: partyCodeParam, guestName } = request;

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return sendInvalidBodyError(res, 'partyCode');
  }

  const result = await PartyDb.tryGetByCode(database, partyCode);
  if (PartyDb.isError(result)) {
    switch (result.kind) {
      case PartyDb.ErrorType.PartyNotFound:
        return sendPartyNotFoundError(res, partyCode);
      case PartyDb.ErrorType.InvalidEntry:
        return sendGenericServerError(res); // TODO: Handle better
    }
  }

  const guest = User.makeGuest(guestName);
  const partyWithGuest = Party.addGuestTo(result, guest);

  await PartyDb.store(database, partyWithGuest);
  sendSuccess(res, StatusCodes.OK, {});
}
