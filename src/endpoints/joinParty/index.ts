import { JoinPartyBody, JoinPartyResult } from '../joinParty/dto';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { User } from '@common/types/user';
import { Party } from '@common/types/party';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';

export default requestHandler<JoinPartyBody, JoinPartyResult>(async (req) => {
  const { partyCode: partyCodeParam, guestName } = req.body;

  const partyCode = PartyCode.tryMake(partyCodeParam);
  if (partyCode === null) {
    return Respond.withInvalidBodyError('partyCode');
  }

  const result = await PartyDb.tryGetByCode(firebaseDb, partyCode);
  if (PartyDb.isError(result)) {
    switch (result.kind) {
      case PartyDb.ErrorType.PartyNotFound:
        return Respond.withPartyNotFoundError(partyCode);
      case PartyDb.ErrorType.InvalidEntry:
        return Respond.withNotImplementedError(); // TODO: Handle better
    }
  }

  const guest = User.makeGuest(guestName);
  const partyWithGuest = Party.addGuestTo(result, guest);

  await PartyDb.store(firebaseDb, partyWithGuest);
  return Respond.withOk({});
});
