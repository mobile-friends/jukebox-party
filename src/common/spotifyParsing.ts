import { Track } from '@common/types/track';
import { Duration } from '@common/types/duration';
import { Artist } from '@common/types/artist';

type TrackLike =
  | SpotifyApi.TrackObjectFull
  | SpotifyApi.RecommendationTrackObject;

function makeDurationOfMillis(millis: number): Duration {
  return Duration.makeFromSeconds(millis / 1000);
}

/**
 * Extracts the duration from a Spotify track
 * @param track The track
 */
export function parseDurationOf(track: TrackLike): Duration {
  return makeDurationOfMillis(track.duration_ms);
}

/**
 * Converts a Spotify artist to a domain artist
 * @param artist The artist
 */
export function parseArtist(artist: SpotifyApi.ArtistObjectSimplified): Artist {
  return Artist.make(artist.name, artist.id, []);
}

/**
 * Extracts the artists from a Spotify track
 * @param track The track
 */
export function parseArtistsOf(track: TrackLike): Artist[] {
  return track.artists.map(parseArtist);
}

/**
 * Extracts the album-art-url from a Spotify track
 * @param track The track
 */
export function parseAlbumArtUrlOf(track: TrackLike): string {
  return track.album.images[0].url;
}

/**
 * Converts a Spotify track to a domain track
 * @param track The track
 */
export function parseTrack(track: TrackLike): Track {
  return Track.make(
    track.name,
    parseDurationOf(track),
    parseArtistsOf(track),
    parseAlbumArtUrlOf(track),
    track.id,
    []
  );
}
