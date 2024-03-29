import axios from 'axios';
import { Track } from '@common/types/track';
import { parseTrack } from '@common/spotifyParsing';
import * as querystring from 'querystring';
import { PlaybackState } from '@common/types/playbackState';
import { Duration } from '@common/types/duration';
import HTTPMethod from 'http-method-enum';
import { StatusCodes } from 'http-status-codes';
import { SpotifyUser } from './types/user';
import { Artist } from './types/artist';

type SpotifyError = { error: SpotifyApi.ErrorObject };

type ResponseData<T> = T | SpotifyError;

type SpotifyResponse<T> = [ResponseData<T>, StatusCodes];

const axiosClient = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: () => true,
});

function isError<T>(data: ResponseData<T>): data is SpotifyError {
  return typeof data == 'object' && data !== null && 'error' in data;
}

async function makeRequest<T>(
  url: string,
  method: HTTPMethod,
  spotifyToken: string
): Promise<SpotifyResponse<T>> {
  const response = await axiosClient.request<ResponseData<T>>({
    url,
    method,
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
  });
  if (isError(response.data)) {
    console.error('Request to spotify caused an error', {
      url,
      method,
      error: response.data.error,
    });
  }
  return [response.data, response.status];
}

function get<T>(
  url: string,
  spotifyToken: SpotifyToken
): Promise<SpotifyResponse<T>> {
  return makeRequest(url, HTTPMethod.GET, spotifyToken);
}

function post<T>(
  url: string,
  spotifyToken: SpotifyToken
): Promise<SpotifyResponse<T>> {
  return makeRequest(url, HTTPMethod.POST, spotifyToken);
}

function put<T>(
  url: string,
  spotifyToken: SpotifyToken
): Promise<SpotifyResponse<T>> {
  return makeRequest(url, HTTPMethod.PUT, spotifyToken);
}

/**
 * Contains functions for interacting with the spotify-api
 */
export namespace SpotifyClient {
  /**
   * Returns information of spotif user
   * @param spotifyToken An active spotify token
   * @returns Promise<SpotifyUser>
   */
  export async function getSpotifyUserInfo(
    spotifyToken: SpotifyToken
  ): Promise<SpotifyUser> {
    const [data] = await get<SpotifyApi.CurrentUsersProfileResponse>(
      'me',
      spotifyToken
    );
    if (isError(data)) {
      // TODO: Handle errors [JUKE-139]
      throw new Error();
    }
    return {
      nickname:
        data.display_name === undefined ? 'undefined' : data.display_name,
      email: data.email === undefined ? 'undefined' : data.email,
      account_type: data.product === undefined ? 'undefined' : data.product,
    };
  }

  /**
   * Gets a list of recommended tracks
   * @param spotifyToken An active spotify token
   * @param seedTrackIds A list of track-ids to base the recommendations on
   */
  export async function getRecommendations(
    spotifyToken: SpotifyToken,
    seedTrackIds: Track[],
    seedArtistIds: Artist[],
    seedGenreIds: string[],
    limit = 10
  ): Promise<Track[]> {
    // TODO: Handle no seed tracks
    const url = `/recommendations?${querystring.stringify({
      limit,
      seed_tracks: seedTrackIds.map((t) => t.id).join(','),
      seed_artists: seedArtistIds.map((t) => t.id).join(','),
      seed_genres: seedGenreIds.join(','),
    })}`;
    const [data] = await get<SpotifyApi.RecommendationsFromSeedsResponse>(
      url,
      spotifyToken
    );
    if (isError(data)) {
      // If anything went wrong we just return no recommendations
      // TODO: Handle errors [JUKE-139]
      return [];
    }

    return data.tracks.map(parseTrack);
  }

  /**
   * Gets the currently playing track or null if no track is playing
   * @param spotifyToken An active spotify token
   */
  export async function getCurrentTrack(
    spotifyToken: SpotifyToken
  ): Promise<Track | null> {
    const url = `me/player/currently-playing`;
    const [data] = await get<SpotifyApi.CurrentlyPlayingResponse | ''>(
      url,
      spotifyToken
    );
    if (isError(data)) {
      // TODO: Handle errors [JUKE-139]
      return null;
    }

    // Sometimes spotify returns a 204 (no content) when trying to get the track
    // In that case, data will be empty. Return null for now
    // TODO: Think of a better solution
    if (data === '') return null;

    const playingItem = data.item;
    if (playingItem === null || playingItem === undefined) return null;
    else if (playingItem.type === 'track') return parseTrack(playingItem);
    else return null;
  }

  /**
   * Gets ids of recently played tracks
   * @param spotifyToken An active spotify token
   */
  export async function getRecentlyPlayedTrackIds(
    spotifyToken: SpotifyToken
  ): Promise<string[]> {
    const url = `me/player/recently-played?${querystring.stringify({
      limit: 5,
      before: Date.now(),
    })}`;
    const [data] = await get<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
      url,
      spotifyToken
    );
    if (isError(data)) {
      // TODO: Handle error [JUKE-139]
      return [];
    }
    return data.items.map((it) => it.track.id);
  }

  /**
   * Sets the current playback-status
   * @param spotifyToken An active spotify token
   * @param isPlaying Whether to be playing or not
   */
  export async function setPlayback(
    spotifyToken: SpotifyToken,
    isPlaying: boolean
  ) {
    const url = isPlaying ? `me/player/play` : `me/player/pause`;
    const [data] = await put<string>(url, spotifyToken);
    if (isError(data)) {
      // TODO: Handle error [JUKE-139]
      throw new Error();
    }
  }

  /**
   * Skips to the next track
   * @param spotifyToken An active spotify token
   */
  export async function skipToNextTrack(spotifyToken: SpotifyToken) {
    const url = `me/player/next`;
    const [data] = await post<string>(url, spotifyToken);
    if (isError(data)) {
      // TODO: Handle error [JUKE-139]
      throw new Error();
    }
  }

  /**
   * Returns to the previous track
   * @param spotifyToken An active spotify token
   */
  export async function backToPreviousTrack(spotifyToken: SpotifyToken) {
    const url = `me/player/previous`;
    const [data] = await post<string>(url, spotifyToken);
    if (isError(data)) {
      // TODO: Handle error [JUKE-139]
      throw new Error();
    }
  }

  /**
   * Searches tracks matching a query
   * @param spotifyToken An active spotify token
   * @param query The query
   */
  export async function searchTracks(
    spotifyToken: SpotifyToken,
    query: string
  ): Promise<Track[]> {
    function parseTracksIn(response: SpotifyApi.SearchResponse): Track[] {
      /*
    Currently, if the request returns undefined somewhere, we just use default
    values to compensate, like [] if tracks is undefined.
    TODO: Handle these errors better [JUKE-139]
    */
      const unparsedTracks = response.tracks?.items ?? [];
      return unparsedTracks.map(parseTrack);
    }

    const url = `/search?${querystring.stringify({
      q: query,
      type: 'track',
    })}`;
    const [data] = await get<SpotifyApi.SearchResponse>(url, spotifyToken);

    if (isError(data)) {
      // TODO: Handle error [JUKE-139]
      return [];
    }
    return parseTracksIn(data);
  }

  /**
   * Gets a tracks matching an id
   * @param spotifyToken An active spotify token
   * @param id The id of the track
   */
  export async function getTrack(
    spotifyToken: SpotifyToken,
    id: string
  ): Promise<Track> {
    function parseTrack(response: SpotifyApi.SingleTrackResponse): Track {
      const { name, duration_ms, artists, album, id } = response;
      const albumCoverUrl: string = album.images?.[0].url;
      const artistsDomain = artists.map((artist) =>
        Artist.make(artist.name, artist.id, [])
      );
      return Track.make(
        name,
        Duration.makeFromMillis(duration_ms),
        artistsDomain,
        albumCoverUrl,
        id,
        []
      );
    }

    const url = `/tracks/${id}`;
    const [data] = await get<SpotifyApi.SingleTrackResponse>(url, spotifyToken);
    if (isError(data)) {
      throw new Error();
    }
    return parseTrack(data);
  }

  /**
   * Gets an artist matching an id
   * @param spotifyToken An active spotify token
   * @param id The id of the artist
   */
  export async function getArtist(
    spotifyToken: SpotifyToken,
    id: string
  ): Promise<Artist> {
    function parseArtist(response: SpotifyApi.SingleArtistResponse): Artist {
      const { name, genres, id } = response;
      return Artist.make(name, id, genres) ?? {};
    }

    const url = `/artists/${id}`;
    const [data] = await get<SpotifyApi.SingleArtistResponse>(
      url,
      spotifyToken
    );
    if (isError(data)) {
      throw new Error();
    }
    return parseArtist(data);
  }

  /**
   * Gets the current playback-state
   * @param spotifyToken An active spotify token
   */
  export async function getPlaybackState(
    spotifyToken: SpotifyToken
  ): Promise<PlaybackState | null | undefined> {
    function parsePlaybackState(
      response: SpotifyApi.CurrentPlaybackResponse
    ): PlaybackState | null {
      const track =
        response.item !== null && response.item.type === 'track'
          ? parseTrack(response.item)
          : null;
      return track !== null
        ? PlaybackState.make(
            track,
            Duration.makeFromMillis(response.progress_ms ?? 0),
            response.is_playing
          )
        : null;
    }

    const url = 'me/player/';
    const [data, status] = await get<SpotifyApi.CurrentPlaybackResponse>(
      url,
      spotifyToken
    );

    // This means that spotify is not currently playing
    if (status === StatusCodes.NO_CONTENT) return null;

    if (isError(data)) {
      // This happens sporadically when too many requests are sent with one token for too long.
      if (status === StatusCodes.SERVICE_UNAVAILABLE) return undefined;

      // TODO: Handle errors [JUKE-139]
      throw new Error();
    }

    return parsePlaybackState(data);
  }

  /**
   * Gets the tracks that are currently in queue
   * @param spotifyToken An active spotify token
   */
  export async function getQueue(spotifyToken: SpotifyToken): Promise<Track[]> {
    function isTrackItem(
      item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull
    ): item is SpotifyApi.TrackObjectFull {
      return item.type === 'track';
    }

    function parseTracksIn(response: SpotifyApi.UsersQueueResponse): Track[] {
      const items = response.queue;
      // Currently we can only handle tracks here
      // A Spotify queue may also contain episodes however
      // For now we just filter those out
      return items.filter(isTrackItem).map(parseTrack);
    }

    const url = '/me/player/queue';
    const [data] = await get<SpotifyApi.UsersQueueResponse>(url, spotifyToken);

    if (isError(data)) {
      // TODO: Handle errors [JUKE-139]
      return [];
    }

    return parseTracksIn(data);
  }

  /**
   * Adds a track to the queue
   * @param spotifyToken An active spotify token
   * @param track The track's ID
   */
  export async function addToQueue(
    spotifyToken: SpotifyToken,
    track: string
  ): Promise<void> {
    const url = `/me/player/queue?uri=spotify:track:${track}`;
    const [data] = await post<void>(url, spotifyToken);

    if (isError(data)) {
      // TODO: Handle errors [JUKE-139]
    }
  }

  /**
   * Checks if the client with the given id is currently playing
   * @param spotifyToken An active spotify token
   */
  export async function isCurrentlyPlaying(
    spotifyToken: SpotifyToken
  ): Promise<boolean> {
    const url = 'me/player/';
    const [data] = await get<SpotifyApi.CurrentPlaybackResponse>(
      url,
      spotifyToken
    );
    // TODO: Handle errors [JUKE-139]
    if (isError(data)) {
      return false;
    }

    return data.is_playing;
  }
}
