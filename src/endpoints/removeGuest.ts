import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { Party } from '@common/types/party';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import {
  DtoError,
  NoContent,
  NotImplementedError,
  PartyNotFoundError,
} from '@common/infrastructure/types';
import { assertNeverReached } from '@common/util/assertions';
import { tryQueryParam } from '@common/util/query';

export interface RemoveGuestBody {
  guestId: UserId;
}

export type RemoveGuestError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type RemoveGuestResult = NoContent | RemoveGuestError;

const PartyCodeQueryParamName = 'partyCode';

export default requestHandler<RemoveGuestBody, RemoveGuestResult>(
  async ({ body, query }) => {
    const partyCodeParam = tryQueryParam(query, PartyCodeQueryParamName);
    if (partyCodeParam === null) {
      return Response.missingQueryParam(PartyCodeQueryParamName);
    }

    const partyCode = PartyCode.tryMake(partyCodeParam);
    if (partyCode === null) {
      return Response.invalidQueryParam(PartyCodeQueryParamName);
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

    const partyWithoutGuest = Party.removeGuest(result, body.guestId);
    await PartyDb.store(firebaseDb, partyWithoutGuest);
    return Response.noContent();
  }
);
