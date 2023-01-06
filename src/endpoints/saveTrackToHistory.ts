import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { requestHandler } from '@common/infrastructure/requestHandler';
import {
  DtoError,
  NoContent,
  NotImplementedError,
  PartyNotFoundError,
} from '@common/infrastructure/types';
import { History } from '@common/types/history';
import { Track } from '@common/types/track';
import { tryQueryParam } from '@common/util/query';
import { Response } from '@common/infrastructure/response';
import { Party } from '@common/types/party';

export interface SaveTrackToHistoryBody {
  track: Track;
}

export type SaveTrackToHistoryError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type SaveTrackToHistoryResult = NoContent | SaveTrackToHistoryError;

const PartyCodeQueryParamName = 'partyCode';

export default requestHandler<SaveTrackToHistoryBody, SaveTrackToHistoryResult>(
  async ({ body, query }) => {
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
      return Response.partyNotFound(partyCode);
    }

    const tmpParty = compareTrackWithHistoryTracks(party, body.track);

    const history = History.addTrackTo(tmpParty.history, body.track);
    const partyWithNewHistory = Party.saveHistory(tmpParty, history);

    await PartyDb.store(firebaseDb, partyWithNewHistory);
    return Response.noContent();
  }
);

// if track is already in the history --> remove it and save it again
// because the last played song should be last
function compareTrackWithHistoryTracks(party: Party, track: Track) {
  party.history.tracks.map(async (item) => {
    if (item.id === track.id) {
      const index = party.history.tracks.indexOf(item);
      party.history.tracks.splice(index, 1);
    }
  });
  return party;
}
