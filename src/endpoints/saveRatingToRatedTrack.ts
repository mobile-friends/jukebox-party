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
import { RatedTrack } from '@common/types/ratedTrack';

export interface SaveRatingToRatedTrackBody {
  track: Track;
  rating: string;
  userId: string;
}

export type SaveRatingToRatedTrackError =
  | DtoError
  | PartyNotFoundError
  | NotImplementedError;

export type SaveRatingToRatedTrackResult =
  | NoContent
  | SaveRatingToRatedTrackError;

const PartyCodeQueryParamName = 'partyCode';

export default requestHandler<
  SaveRatingToRatedTrackBody,
  SaveRatingToRatedTrackResult
>(async ({ body, query }) => {
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

  const index = getIndexOfTrack(party.history, body.track);
  if (index !== null) {
    const rating = getRatingForTrack(
      party.history,
      index,
      body.rating,
      body.userId
    );
    const ratedTrack = RatedTrack.make(
      party.history.tracks[index].track,
      rating
    );
    party.history.tracks[index] = ratedTrack;
    await PartyDb.store(firebaseDb, party);
  }

  return Response.noContent();
});

function getIndexOfTrack(history: History, track: Track): number | null {
  let index = null;
  history.tracks.map((item: RatedTrack) => {
    if (item.track.id === track.id) {
      index = history.tracks.indexOf(item);
    }
  });
  return index;
}

function getRatingForTrack(
  history: History,
  index: number,
  ratingString: string,
  userId: string
) {
  const trackRating = history.tracks[index].rating;

  const like = RatedTrack.makeLike(
    ratingString === 'like'
      ? trackRating.likes.amount + 1
      : trackRating.likes.amount,
    ratingString === 'like'
      ? [...(trackRating.likes.userIds ?? []), userId]
      : trackRating.likes.userIds ?? []
  );

  const dislike = RatedTrack.makeDislike(
    ratingString !== 'like'
      ? trackRating.dislikes.amount + 1
      : trackRating.dislikes.amount,
    ratingString !== 'like'
      ? [...(trackRating.dislikes.userIds ?? []), userId]
      : trackRating.dislikes.userIds ?? []
  );

  return RatedTrack.makeRating(like, dislike);
}
