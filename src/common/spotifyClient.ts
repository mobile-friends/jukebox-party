import axios from 'axios';
import { Track } from '@common/types/track';
import { parseTrack } from '@common/spotifyParsing';
import * as querystring from 'querystring';
import { PlaybackState } from '@common/types/playbackState';
import { Duration } from '@common/types/duration';

export type SpotifyResponse<T> = T | SpotifyApi.ErrorObject;

const axiosClient = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: (_) => true,
});

export function isSpotifyError<T extends {}>(
  response: T | SpotifyApi.ErrorObject
): response is SpotifyApi.ErrorObject {
  return typeof response == 'object' && 'error' in response;
}

async function get<T>(
  url: string,
  spotifyToken: SpotifyToken
): Promise<SpotifyResponse<T>> {
  return axiosClient
    .get<T>(url, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    })
    .then((it) => it.data);
}

async function post<T>(
  url: string,
  spotifyToken: SpotifyToken
): Promise<SpotifyResponse<T>> {
  return axiosClient
    .post<T>(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    )
    .then((it) => it.data);
}

async function put<T>(
  url: string,
  spotifyToken: SpotifyToken
): Promise<SpotifyResponse<T>> {
  return axiosClient
    .put<T>(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    )
    .then((it) => it.data);
}

/**
 * Contains functions for interacting with the spotify-api
 */
export namespace SpotifyClient {
  /**
   * Gets a list of recommended tracks
   * @param spotifyToken An active spotify token
   * @param seedTrackIds A list of track-ids to base the recommendations on
   */
  export async function getRecommendations(
    spotifyToken: SpotifyToken,
    seedTrackIds: string[]
  ): Promise<Track[]> {
    // TODO: Seed tracks, seed artists and seed genres are required
    // TODO: Handle no seed tracks
    const url = `/recommendations?limit=1?${querystring.stringify({
      seed_tracks: seedTrackIds.join(','),
    })}`;
    const response = await get<SpotifyApi.RecommendationsFromSeedsResponse>(
      url,
      spotifyToken
    );
    if (isSpotifyError(response)) {
      // If anything went wrong we just return no recommendations
      // TODO: Handle errors
      console.error(response);
      return [];
    }

    return response.tracks.map(parseTrack);
  }

  /**
   * Gets the currently playing track or null if no track is playing
   * @param spotifyToken An active spotify token
   */
  export async function getCurrentTrack(
    spotifyToken: SpotifyToken
  ): Promise<Track | null> {
    const url = `me/player/currently-playing`;
    const response = await get<SpotifyApi.CurrentlyPlayingResponse | ''>(
      url,
      spotifyToken
    );
    if (isSpotifyError(response)) {
      // TODO: Handle errors
      console.error(response);
      return null;
    }

    // Sometimes spotify returns a 204 (no content) when trying to get the track
    // In that case, data will be empty. Return null for now
    // TODO: Think of a better solution
    if (response === '') return null;

    const playingItem = response.item;
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
    const response = await get<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
      url,
      spotifyToken
    );
    if (isSpotifyError(response)) {
      // TODO: Handle error
      console.error(response);
      return [];
    }
    return response.items.map((it) => it.track.id);
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
    const url = `me/player/pause`;
    const response = await put<string>(url, spotifyToken);
    if (isSpotifyError(response)) {
      // TODO: Handle error
      console.error(response);
      throw new Error();
    }
  }

  /**
   * Skips to the next track
   * @param spotifyToken An active spotify token
   */
  export async function skipToNextTrack(spotifyToken: SpotifyToken) {
    const url = `me/player/next`;
    const response = await post<string>(url, spotifyToken);
    if (isSpotifyError(response)) {
      // TODO: Handle error
      console.error(response);
      throw new Error();
    }
  }

  /**
   * Returns to the previous track
   * @param spotifyToken An active spotify token
   */
  export async function backToPreviousTrack(spotifyToken: SpotifyToken) {
    const url = `me/player/previous`;
    const response = await post<string>(url, spotifyToken);
    if (isSpotifyError(response)) {
      // TODO: Handle error
      console.error(response);
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
    TODO: Handle these errors better
    */
      const unparsedTracks = response.tracks?.items ?? [];
      return unparsedTracks.map(parseTrack);
    }

    const url = `/search?${querystring.stringify({
      q: query,
      type: 'track',
    })}`;
    const response = await get<SpotifyApi.SearchResponse>(url, spotifyToken);

    if (isSpotifyError(response)) {
      // TODO: Handle error
      console.error(response);
      return [];
    }
    return parseTracksIn(response);
  }

  /**
   * Gets the current playback-state
   * @param spotifyToken An active spotify token
   */
  export async function getPlaybackState(
    spotifyToken: SpotifyToken
  ): Promise<PlaybackState> {
    function parsePlaybackState(
      response: SpotifyApi.CurrentPlaybackResponse
    ): PlaybackState {
      return PlaybackState.make(
        Duration.makeFromMillis(response.progress_ms ?? 0),
        response.is_playing
      );
    }

    const url = 'me/player/';
    const response = await get<SpotifyApi.CurrentPlaybackResponse>(
      url,
      spotifyToken
    );

    // TODO: Handle errors
    if (isSpotifyError(response)) {
      console.error(response);
      return PlaybackState.make(Duration.Zero, false);
    }

    return parsePlaybackState(response);
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
    const response = await get<SpotifyApi.UsersQueueResponse>(
      url,
      spotifyToken
    );

    if (isSpotifyError(response)) {
      // TODO: We get a 403 from spotify here. Idk why
      // TODO: Handle errors
      console.error(response);
      return [];
    }

    return parseTracksIn(response);
  }
}
