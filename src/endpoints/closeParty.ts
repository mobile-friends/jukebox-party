import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { Party } from '@common/types/party';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import {
  DtoError,
  NoContent,
  NotImplementedError,
  PartyNotFoundError,
} from '@common/infrastructure/types';
import { assertNeverReached } from '@common/util/assertions';
import { tryQueryParam } from '@common/util/query';

export type ClosePartyError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type ClosePartyResult = NoContent | ClosePartyError;

const PartyCodeQueryParamName = 'partyCode';

export default requestHandler<NoBody, ClosePartyResult>(async ({ query }) => {
  const partyCodeParam = tryQueryParam(query, PartyCodeQueryParamName);
  if (partyCodeParam === null) {
    return Response.missingQueryParam(PartyCodeQueryParamName);
  }

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return Response.invalidQueryParam(PartyCodeQueryParamName);
  }

  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);
  if (PartyDb.isError(party)) {
    switch (party.kind) {
      case PartyDb.ErrorType.PartyNotFound:
        return Response.partyNotFound(partyCode);
      case PartyDb.ErrorType.InvalidEntry:
        return Response.notImplemented(); // TODO: Handle better [JUKE-141]
      default:
        return assertNeverReached(party);
    }
  }

  const guests = Party.guestsOf(party);

  let partyWithoutGuests = null;
  guests.map((guest) => {
    partyWithoutGuests = Party.removeGuest(party, guest.id);
  });

  if (partyWithoutGuests != null) {
    await PartyDb.store(firebaseDb, partyWithoutGuests);
  }

  return Response.noContent();
});
