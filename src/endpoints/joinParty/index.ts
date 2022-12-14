import { NextApiRequest, NextApiResponse } from 'next';
import { JoinPartyDto, JoinPartyResponse } from '../joinParty/dto';
import { PartyCode } from '@common/partyCode';
import {
  sendGenericServerError,
  sendInvalidBodyError,
  sendPartyNotFoundError,
} from '@common/errors';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { User } from '@common/user';
import { Party } from '@common/party';
import { sendSuccess } from '@common/apiResponse';
import { StatusCodes } from 'http-status-codes';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<JoinPartyResponse>
) {
  const request = req.body as JoinPartyDto;
  const { partyCode: partyCodeParam, guestName } = request;

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return sendInvalidBodyError(res, 'partyCode');
  }

  const result = await PartyDb.tryGetByCode(firebaseDb, partyCode);
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

  await PartyDb.store(firebaseDb, partyWithGuest);
  sendSuccess(res, StatusCodes.OK, {});
}
