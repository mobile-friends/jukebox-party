import firebaseDb from '@common/firebaseDb';
import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import {
  NoSpotifyError,
  NotImplementedError,
  Ok,
  PartyNotFoundError,
} from '@common/infrastructure/types';
import { JukeClient } from '@common/jukeClient';
import { PartyDb } from '@common/partyDb';
import { SpotifyClient } from '@common/spotifyClient';
import { Party } from '@common/types/party';
import { PartyCode } from '@common/types/partyCode';
import { Track } from '@common/types/track';
import { tryQueryParam } from '@common/util/query';

export interface GetRecommendationsSuccess {
  items: Track[];
}

export type GetRecommendationsError =
  | NoSpotifyError
  | NotImplementedError
  | PartyNotFoundError;

export type GetRecommendationsResult =
  | Ok<GetRecommendationsSuccess>
  | GetRecommendationsError;

export async function getRecommendationsWith(
  partyCode: PartyCode,
  spotifyToken: SpotifyToken
) {
  let useHistory = false;
  let historyTracks: Track[] = [];
  const party = (await PartyDb.tryGetByCode(firebaseDb, partyCode)) as Party;
  const history = Party.historyOf(party);
  const historyIsInUse = history?.tracks?.length > 1;
  if (historyIsInUse) {
    useHistory = true;
    historyTracks = history.tracks.map((track) => track.track).slice(0, 3);
  }

  const currentTrack = (await SpotifyClient.getCurrentTrack(
    spotifyToken
  )) as Track;

  const seedArtist = await SpotifyClient.getArtist(
    spotifyToken,
    currentTrack.artists[0].id
  );
  const seedGenres = seedArtist.genres.slice(0, useHistory ? 1 : 3);
  const limit = 7;

  return await SpotifyClient.getRecommendations(
    spotifyToken,
    useHistory ? historyTracks : [currentTrack],
    [seedArtist],
    seedGenres,
    limit
  );
}

const PartyCodeQueryParamName = 'partyCode';

export default requestHandler<NoBody, GetRecommendationsResult>(async (req) => {
  // TODO using real TypeScript
  const partyCodeParam = tryQueryParam(req.query, PartyCodeQueryParamName);
  const partyCode = PartyCode.tryMake(partyCodeParam as string) as PartyCode;

  const spotifyToken = req.spotifyToken;
  if (spotifyToken === null) {
    return Response.noSpotify();
  }

  const items = await getRecommendationsWith(partyCode, spotifyToken);
  return Response.ok<GetRecommendationsSuccess>({ items });
});
