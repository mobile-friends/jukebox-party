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
import { RatedTrack } from '@common/types/ratedTrack';

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

    let history = null;
    if (party.history.tracks.length > 0) {
      party.history.tracks.map(async (item) => {
        if (item.track.id === body.track.id) {
          const index = party.history.tracks.indexOf(item);
          const ratedTrack = party.history.tracks[index];
          party.history.tracks.splice(index, 1);
          history = History.addRatedTrackTo(party.history, ratedTrack);
        } else {
          history = History.addTrackTo(party.history, body.track);
        }
      });
    } else {
      history = History.addTrackTo(party.history, body.track);
      const partyWithNewHistory = Party.saveHistory(party, history);
      await PartyDb.store(firebaseDb, partyWithNewHistory);
    }

    if (history !== null) {
      const partyWithNewHistory = Party.saveHistory(party, history);
      await PartyDb.store(firebaseDb, partyWithNewHistory);
    }

    return Response.noContent();
  }
);
