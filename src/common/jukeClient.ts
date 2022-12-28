import axios from 'axios';
import { ApiResponse, ApiResult } from '@common/infrastructure/types';
import {
  CreatePartyBody,
  CreatePartyResult,
  CreatePartySuccess,
} from '@endpoint/createParty/dto';
import { JoinPartyBody, JoinPartyResult } from '@endpoint/joinParty/dto';
import { isSuccess } from '@common/infrastructure/response';
import { PartyCode } from '@common/types/partyCode';
import { Track } from '@common/types/track';
import { GetPartyTrackResult } from '@endpoint/getPartyTrack/dto';
import { PlaybackState } from '@common/types/playbackState';
import { GetPlaybackResult } from '@endpoint/getPlayback/dto';
import { NoBody } from '@common/infrastructure/requestHandler';
import { PauseResult } from '@endpoint/pause/dto';
import { GetQueueResult } from '@endpoint/getQueue/dto';
import { SearchTracksResult } from '@endpoint/searchTracks/dto';
import * as querystring from 'querystring';
import { SkipDirection } from '@common/types/global';
import { SkipResult } from '@endpoint/skip/dto';

// TODO: Move port into env and load dynamically
const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: () => true,
});

async function get<TResult extends ApiResult>(
  url: string
): Promise<ApiResponse<TResult>> {
  return axiosClient.get<ApiResponse<TResult>>(url).then((it) => it.data);
}

async function post<TBody, TResult extends ApiResult>(
  url: string,
  body: TBody
): Promise<ApiResponse<TResult>> {
  return axiosClient
    .post<ApiResponse<TResult>>(url, body)
    .then((it) => it.data);
}

async function put<TBody, TResult extends ApiResult>(
  url: string,
  body: TBody
): Promise<ApiResponse<TResult>> {
  return axiosClient.put<ApiResponse<TResult>>(url, body).then((it) => it.data);
}

/**
 * Contains functions for interacting with the jukebox api
 */
export namespace JukeClient {
  /**
   * Create a new party
   * @param partyName The name of the party
   * @param hostName The name of the host
   * @param spotifyToken The spotify-token the party should use
   */
  export async function createParty(
    partyName: string,
    hostName: string,
    spotifyToken: string
  ): Promise<CreatePartySuccess> {
    const url = 'parties';
    const body = {
      partyName,
      hostName,
      spotifyToken,
    };
    const response = await post<CreatePartyBody, CreatePartyResult>(url, body);
    return response.data;
  }

  /**
   * Join a party
   * @param partyCode The code of the party
   * @param guestName The name of the guest that wants to join
   */
  export async function joinParty(
    partyCode: PartyCode,
    guestName: string
  ): Promise<string | null> {
    const url = 'parties/join';
    const body = {
      partyCode,
      guestName,
    };
    const response = await post<JoinPartyBody, JoinPartyResult>(url, body);
    if (!isSuccess(response)) {
      console.error(response);
      return null;
    }
    return response.data.userId;
  }

  /**
   * Gets the current track of a party
   * @param partyCode The code of the party
   */
  export async function getCurrentTrack(
    partyCode: PartyCode
  ): Promise<Track | null> {
    const url = `parties/${partyCode}/track`;
    const response = await get<GetPartyTrackResult>(url);
    if (isSuccess(response)) {
      return response.data.track;
    } else {
      console.error(response); // TODO: Handle errors
      return null;
    }
  }

  /**
   * Gets the current playback-state of a party
   * @param partyCode The code of the party
   */
  export async function getPlayback(
    partyCode: PartyCode
  ): Promise<PlaybackState> {
    const url = '/player/';
    const response = await get<GetPlaybackResult>(url);
    if (isSuccess(response)) return response.data.playbackState;
    else {
      console.error(response); // TODO: Handle errors
      throw new Error('Error not handled');
    }
  }

  /**
   * Pauses playback on a party
   * @param partyCode The code of the party
   */
  export async function pausePlayback(partyCode: PartyCode): Promise<void> {
    const url = '/player/pause';
    const response = await put<NoBody, PauseResult>(url, {});
    if (isSuccess(response)) return;
    else {
      console.error(response); // TODO: Handle errors
      throw new Error('Error not handled');
    }
  }

  /**
   * Starts playback on a party
   * @param partyCode The code of the party
   */
  export async function startPlayback(partyCode: PartyCode): Promise<void> {
    const url = '/player/play';
    const response = await put<NoBody, PauseResult>(url, {});
    if (isSuccess(response)) return;
    else {
      console.error(response); // TODO: Handle errors
      throw new Error('Error not handled');
    }
  }

  /**
   * Gets the track-queue on a party
   * @param partyCode The code of the party
   */
  export async function getQueue(partyCode: PartyCode): Promise<Track[]> {
    const url = `parties/${partyCode}/queue`;
    const response = await get<GetQueueResult>(url);
    if (isSuccess(response)) {
      return response.data.tracks;
    } else {
      console.error(response); // TODO: Handle errors
      throw new Error('Error not handled');
    }
  }

  /**
   * Performs a search for tracks
   * @param partyCode The code of the party
   * @param query The search query
   */
  export async function searchTracks(
    partyCode: PartyCode,
    query: string
  ): Promise<Track[]> {
    const url = `/search?${querystring.stringify({
      q: query,
    })}`;
    const response = await get<SearchTracksResult>(url);
    if (isSuccess(response)) return response.data.tracks;
    else {
      console.error(response); // TODO: Handle errors
      throw new Error('Error not handled');
    }
  }

  /**
   * Skips a parties playback forward or backward
   * @param partyCode The code of the party
   * @param direction The skip direction
   */
  export async function skip(
    partyCode: PartyCode,
    direction: SkipDirection
  ): Promise<void> {
    const url = `/skip?${querystring.stringify({
      direction,
    })}`;
    const response = await get<SkipResult>(url);
    if (!isSuccess(response)) {
      console.error(response); // TODO: Handle errors
      throw new Error('Error not handled');
    }
  }
}
