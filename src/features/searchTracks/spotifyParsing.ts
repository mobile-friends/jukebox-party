import { Track } from '@common/track';
import { Duration } from '@common/duration';
import { Artist } from '@common/artist';

/**
 * Extracts the duration from a Spotify track
 * @param track The track
 */
export function parseDurationOf(track: SpotifyApi.TrackObjectFull): Duration {
  return Duration.makeFromSeconds(track.duration_ms / 1000);
}

/**
 * Converts a Spotify artist to a domain artist
 * @param artist The artist
 */
export function parseArtist(artist: SpotifyApi.ArtistObjectSimplified): Artist {
  return Artist.make(artist.name);
}

/**
 * Extracts the artists from a Spotify track
 * @param track The track
 */
export function parseArtistsOf(track: SpotifyApi.TrackObjectFull): Artist[] {
  return track.artists.map(parseArtist);
}

/**
 * Extracts the album-art-url from a Spotify track
 * @param track The track
 */
export function parseAlbumArtUrlOf(track: SpotifyApi.TrackObjectFull): string {
  return track.album.images[0].url;
}

/**
 * Converts a Spotify track to a domain track
 * @param track The track
 */
export function parseTrack(track: SpotifyApi.TrackObjectFull): Track {
  return Track.make(
    track.name,
    parseDurationOf(track),
    parseArtistsOf(track),
    parseAlbumArtUrlOf(track)
  );
}

/**
 * Parses the tracks from a Spotify search-response object
 * @param response The response
 */
export function parseTracksIn(response: SpotifyApi.SearchResponse): Track[] {
  /*
Currently, if the request returns undefined somewhere, we just use default
values to compensate, like [] if tracks is undefined.
TODO: Handle these errors better
*/
  const unparsedTracks = response.tracks?.items ?? [];
  return unparsedTracks.map(parseTrack);
}
