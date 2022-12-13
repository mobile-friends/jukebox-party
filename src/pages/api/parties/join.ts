import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../firebase.config';
import { Party } from '@src/lib/party';
import { User } from '@src/lib/user';
import { PartyCode } from '@src/lib/partyCode';
import { PartyDb } from '@src/lib/partyDb';
import { ApiResponse, sendSuccess } from '@src/common/apiResponse';
import {
  sendGenericServerError,
  sendInvalidBodyError,
  sendPartyNotFoundError,
} from '@src/common/errors';
import { StatusCodes } from 'http-status-codes';
import { multiMethodHandler } from '@src/common/apiUtil';
import HTTPMethod from 'http-method-enum';

export interface JoinPartyDto {
  partyCode: string;
  guestName: string;
}

export type PartyJoinedDto = {};

export type JoinPartyError = never;

export type JoinPartyResponse = ApiResponse<PartyJoinedDto, JoinPartyError>;

async function handlePost(
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

export default multiMethodHandler({
  [HTTPMethod.POST]: handlePost,
});
