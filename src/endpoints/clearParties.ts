import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { DtoError, NoContent } from '@common/infrastructure/types';
import { Response } from '@common/infrastructure/response';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';

export interface ClearPartyDbBody {
  secret: string;
}

export default requestHandler<ClearPartyDbBody, NoContent | DtoError>(
  async (req) => {
    if (req.body.secret !== process.env.CLEAR_PARTIES_SECRET)
      return Response.invalidBody('secret');
    PartyDb.clear(firebaseDb);
    return Response.noContent();
  }
);
