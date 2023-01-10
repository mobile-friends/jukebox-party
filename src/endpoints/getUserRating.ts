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
import { tryQueryParam } from '@common/util/query';
import { Response } from '@common/infrastructure/response';
import { Track } from '@common/types/track';
import { Party } from '@common/types/party';

export interface GetUserRatingBody {
  track: Track;
  userId: string;
}

export interface GetUserRatingSuccess {
  rating: string;
}

export type GetUserRatingError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type GetUserRatingResult = Ok<GetUserRatingSuccess> | GetUserRatingError;

const PartyCodeQueryParamName = 'partyCode';
const TrackIdQueryParamName = 'trackId';
const UserIdQueryParamName = 'userId';

export default requestHandler<GetUserRatingBody, GetUserRatingResult>(
  async (req) => {
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

    const trackId = tryQueryParam(req.query, TrackIdQueryParamName);
    const userId = tryQueryParam(req.query, UserIdQueryParamName);

    const history = Party.historyOf(party);
    const ratedTrack = history.tracks.find((item) => item.track.id === trackId);

    let rating = '';
    if (ratedTrack) {
      if (
        ratedTrack.rating.likes.userIds &&
        ratedTrack.rating.likes.userIds.find((item) => item === userId)
      )
        rating = 'like';
      else if (
        ratedTrack.rating.dislikes.userIds &&
        ratedTrack.rating.dislikes.userIds.find((item) => item === userId)
      )
        rating = 'dislike';
    }

    return Response.ok<GetUserRatingSuccess>({ rating: rating });
  }
);
