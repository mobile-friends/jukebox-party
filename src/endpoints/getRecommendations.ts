import { NoBody, requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';
import {
  NoSpotifyError,
  NotImplementedError,
  Ok,
} from '@common/infrastructure/types';
import { SpotifyClient } from '@common/spotifyClient';
import { Track } from '@common/types/track';

export interface GetRecommendationsSuccess {
  items: Track[];
}

export type GetRecommendationsError = NoSpotifyError | NotImplementedError;

export type GetRecommendationsResult =
  | Ok<GetRecommendationsSuccess>
  | GetRecommendationsError;

export async function getRecommendationsWith(spotifyToken: SpotifyToken) {
  const seedTrack = (await SpotifyClient.getCurrentTrack(
    spotifyToken
  )) as Track;
  const seedArtist = await SpotifyClient.getArtist(
    spotifyToken,
    seedTrack.artists[0].id
  );
  const seedGenres = seedArtist.genres.slice(0, 3) ;
  const limit = 7;

  return await SpotifyClient.getRecommendations(
    spotifyToken,
    [seedTrack],
    [seedArtist],
    seedGenres,
    limit
  );
}

export default requestHandler<NoBody, GetRecommendationsResult>(
  async ({ spotifyToken }) => {
    if (spotifyToken === null) {
      return Response.noSpotify();
    }
    const items = await getRecommendationsWith(spotifyToken);
    return Response.ok<GetRecommendationsSuccess>({ items });
  }
);
