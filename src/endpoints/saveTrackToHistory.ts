import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { requestHandler } from '@common/infrastructure/requestHandler';
import {
  DtoError,
  NotImplementedError,
  Ok,
  PartyNotFoundError,
} from '@common/infrastructure/types';
import { History } from '@common/types/history';
import { Track } from '@common/types/track';
import { tryQueryParam } from '@common/util/query';
import { Response } from '@common/infrastructure/response';
import { assertNeverReached } from '@common/util/assertions';
import { Party } from '@common/types/party';

export interface SaveTrackToHistoryBody {
  track: Track;
}

export interface SaveTrackToHistorySuccess {
  history: History;
}

export type SaveTrackToHistoryError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type SaveTrackToHistoryResult =
  | Ok<SaveTrackToHistorySuccess>
  | SaveTrackToHistoryError;

const PartyCodeQueryParamName = 'partyCode';

export default requestHandler<SaveTrackToHistoryBody, SaveTrackToHistoryResult>(
  async (req) => {
    const { track } = req.body;

    const partyCodeParam = tryQueryParam(req.query, PartyCodeQueryParamName);
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

    // if track is already in the history --> remove it and save it again
    // because the last played song should be last
    party.history.tracks.map(async (item) => {
      if (item.name == track.name) {
        console.log(item.name);
        const index = party.history.tracks.indexOf(item);
        party.history.tracks.splice(index, 1);
      }
    });

    const history = History.addTrackTo(party, track);
    const partyWithNewHistory = Party.saveHistory(party, history);

    await PartyDb.store(firebaseDb, partyWithNewHistory);

    return Response.ok<SaveTrackToHistorySuccess>({ history: history });
  }
);
