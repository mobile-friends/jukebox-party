import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResult, ErrorResult } from '@common/infrastructure/types';
import { PartyCode } from '@common/types/partyCode';
import { Track } from '@common/types/track';
import { PlaybackState } from '@common/types/playbackState';
import { NoBody } from '@common/infrastructure/requestHandler';
import * as querystring from 'querystring';
import {
  PartyCredentials,
  SkipDirection,
  SpotifyToken,
} from '@common/types/global';
import { CreatePartyBody, CreatePartyResult } from '@endpoint/createParty';
import { JoinPartyBody, JoinPartyResult } from '@endpoint/joinParty';
import { GetPartyTrackResult } from '@endpoint/getPartyTrack';
import { PauseResult } from '@endpoint/pause';
import { GetQueueResult } from '@endpoint/getQueue';
import { SearchTracksResult } from '@endpoint/searchTracks';
import { SkipResult } from '@endpoint/skip';
import { GetPlaybackResult } from '@endpoint/getPlayback';
import { StatusCodes } from 'http-status-codes';
import HTTPMethod from 'http-method-enum';

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

function unhandledResultError(
  url: string,
  method: HTTPMethod,
  code: StatusCodes
) {
  return new Error(`Unhandled result-code ${code} from ${method} on ${url}.`);
}

function reportError(response: AxiosResponse) {
  const error = response.data as ErrorResult;
  console.error('The Juke-api returned an error', {
    requestUrl: response.config.url,
    requestBody: response.config.data,
    requestMethod: response.config.method,
    error,
  });
}

async function makeRequest<TResult extends ApiResult>(
  config: AxiosRequestConfig
): Promise<TResult> {
  const response = await axiosClient.request<TResult>(config);
  if (response.status >= 400) reportError(response);
  return response.data;
}

function get<TResult extends ApiResult>(url: string): Promise<TResult> {
  return makeRequest<TResult>({ url, method: 'GET' });
}

function post<TBody, TResult extends ApiResult>(
  url: string,
  body: TBody
): Promise<TResult> {
  return makeRequest<TResult>({ url, method: 'POST', data: body });
}

async function put<TBody, TResult extends ApiResult>(
  url: string,
  body: TBody
): Promise<TResult> {
  return makeRequest<TResult>({ url, method: 'PUT', data: body });
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
    spotifyToken: SpotifyToken
  ): Promise<PartyCredentials> {
    const url = 'parties';
    const body = {
      partyName,
      hostName,
      spotifyToken,
    };
    const result = await post<CreatePartyBody, CreatePartyResult>(url, body);
    if (result.code === StatusCodes.CREATED) {
      return result.content;
    }
    throw unhandledResultError(url, HTTPMethod.POST, result.code);
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
    const url = `parties/${partyCode}/join`;
    const body = {
      partyCode,
      guestName,
    };
    const result = await post<JoinPartyBody, JoinPartyResult>(url, body);
    if (result.code === StatusCodes.OK) {
      return result.content.userId;
    }
    throw unhandledResultError(url, HTTPMethod.POST, result.code);
  }

  /**
   * Gets the current track of a party
   * @param partyCode The code of the party
   */
  export async function getCurrentTrack(
    partyCode: PartyCode
  ): Promise<Track | null> {
    const url = `parties/${partyCode}/track`;
    const result = await get<GetPartyTrackResult>(url);
    if (result.code === StatusCodes.OK) {
      return result.content.track;
    }
    throw unhandledResultError(url, HTTPMethod.GET, result.code);
  }

  /**
   * Gets the current playback-state of a party
   * @param partyCode The code of the party
   */
  export async function getPlayback(
    partyCode: PartyCode
  ): Promise<PlaybackState> {
    const url = `parties/${partyCode}/player/`;
    const result = await get<GetPlaybackResult>(url);
    if (result.code === StatusCodes.OK) {
      return result.content.playbackState;
    }
    throw unhandledResultError(url, HTTPMethod.GET, result.code);
  }

  /**
   * Pauses playback on a party
   * @param partyCode The code of the party
   */
  export async function pausePlayback(partyCode: PartyCode): Promise<void> {
    const url = `parties/${partyCode}/player/pause`;
    const result = await put<NoBody, PauseResult>(url, {});
    if (result.code === StatusCodes.NO_CONTENT) {
      return;
    }
    throw unhandledResultError(url, HTTPMethod.PUT, result.code);
  }

  /**
   * Starts playback on a party
   * @param partyCode The code of the party
   */
  export async function startPlayback(partyCode: PartyCode): Promise<void> {
    const url = `parties/${partyCode}/player/play`;
    const result = await put<NoBody, PauseResult>(url, {});
    if (result.code === StatusCodes.NO_CONTENT) {
      return;
    }
    throw unhandledResultError(url, HTTPMethod.PUT, result.code);
  }

  /**
   * Gets the track-queue on a party
   * @param partyCode The code of the party
   */
  export async function getQueue(partyCode: PartyCode): Promise<Track[]> {
    const url = `parties/${partyCode}/queue`;
    const result = await get<GetQueueResult>(url);
    if (result.code === StatusCodes.OK) {
      return result.content.tracks;
    }
    throw unhandledResultError(url, HTTPMethod.GET, result.code);
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
    const url = `parties/${partyCode}/search?${querystring.stringify({
      q: query,
    })}`;
    const result = await get<SearchTracksResult>(url);
    if (result.code === StatusCodes.OK) {
      return result.content.tracks;
    }
    throw unhandledResultError(url, HTTPMethod.GET, result.code);
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
    const url = `parties/${partyCode}/player/skip?${querystring.stringify({
      direction,
    })}`;
    const result = await get<SkipResult>(url);
    if (result.code === StatusCodes.NO_CONTENT) {
      return;
    }
    throw unhandledResultError(url, HTTPMethod.PUT, result.code);
  }
}
