import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { User } from '@common/types/user';
import { Party } from '@common/types/party';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import { UserId } from '@common/types/global';
import {
  DtoError,
  NotImplementedError,
  Ok,
  PartyNotFoundError,
} from '@common/infrastructure/types';
import { assertNeverReached } from '@common/util/assertions';

export interface JoinPartyBody {
  partyCode: string;
  guestName: string;
}

export interface JoinPartySuccess {
  userId: UserId;
}

export type JoinPartyError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type JoinPartyResult = Ok<JoinPartySuccess> | JoinPartyError;

export default requestHandler<JoinPartyBody, JoinPartyResult>(async (req) => {
  const { partyCode: partyCodeParam, guestName } = req.body;

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return Response.invalidBody('partyCode');
  }

  const result = await PartyDb.tryGetByCode(firebaseDb, partyCode);
  if (PartyDb.isError(result)) {
    switch (result.kind) {
      case PartyDb.ErrorType.PartyNotFound:
        return Response.partyNotFound(partyCode);
      case PartyDb.ErrorType.InvalidEntry:
        return Response.notImplemented(); // TODO: Handle better
      default:
        return assertNeverReached(result);
    }
  }

  const guest = User.makeGuest(guestName);
  const partyWithGuest = Party.addGuestTo(result, guest);

  await PartyDb.store(firebaseDb, partyWithGuest);
  return Response.ok<JoinPartySuccess>({ userId: User.idOf(guest) });
});
