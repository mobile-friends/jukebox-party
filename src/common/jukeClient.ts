import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResult, ErrorResult } from '@common/infrastructure/types';
import { PartyCode } from '@common/types/partyCode';
import * as querystring from 'querystring';
import { CreatePartyBody, CreatePartyResult } from '@endpoint/createParty';
import { JoinPartyBody, JoinPartyResult } from '@endpoint/joinParty';
import { SetPlaybackBody, SetPlaybackResult } from '@endpoint/setPlayback';
import { GetQueueResult } from '@endpoint/getQueue';
import { SearchTracksResult } from '@endpoint/searchTracks';
import { SkipResult } from '@endpoint/skip';
import { GetPlaybackResult } from '@endpoint/getPlayback';
import { SkipDirection } from '@common/types/constants';
import { GetPartyUsersResult } from '@endpoint/getPartyUsers';
import { RemoveGuestBody, RemoveGuestResult } from '@endpoint/removeGuest';
import { Env } from '@common/env';

// TODO: Move port into env and load dynamically [JUKE-138]
const axiosClient = axios.create({
  baseURL: Env.isProduction()
    ? `https://jukebox.herokuapp.com/api/`
    : 'http://localhost:3000/api/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: () => true,
});

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
  const response = await axiosClient.request<Omit<TResult, 'code'>>(config);
  if (response.status >= 400) reportError(response);
  return { code: response.status, ...response.data } as TResult;
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
   * @param body The body of the request
   */
  export function createParty(
    body: CreatePartyBody
  ): Promise<CreatePartyResult> {
    const url = 'parties';
    return post<CreatePartyBody, CreatePartyResult>(url, body);
  }

  /**
   * Join a party
   * @param body The body of the request
   */
  export function joinParty(body: JoinPartyBody): Promise<JoinPartyResult> {
    const url = `parties/${body.partyCode}/join`;
    return post<JoinPartyBody, JoinPartyResult>(url, body);
  }

  /**
   * Gets the users of a party
   * @param partyCode The code of the party
   */
  export function getPartyUsers(
    partyCode: PartyCode
  ): Promise<GetPartyUsersResult> {
    const url = `parties/${partyCode}/users`;
    return get<GetPartyUsersResult>(url);
  }

  /**
   * Gets the current playback-state of a party
   * @param partyCode The code of the party
   */
  export function getPlayback(
    partyCode: PartyCode
  ): Promise<GetPlaybackResult> {
    const url = `parties/${partyCode}/player`;
    return get<GetPlaybackResult>(url);
  }

  /**
   * Pauses playback on a party
   * @param partyCode The code of the party
   * @param isPlaying Whether playback should be playing or paused
   */
  export function setPlayback(
    partyCode: PartyCode,
    isPlaying: boolean
  ): Promise<SetPlaybackResult> {
    const url = `parties/${partyCode}/player`;
    return put<SetPlaybackBody, SetPlaybackResult>(url, { isPlaying });
  }

  /**
   * Gets the track-queue on a party
   * @param partyCode The code of the party
   */
  export function getQueue(partyCode: PartyCode): Promise<GetQueueResult> {
    const url = `parties/${partyCode}/queue`;
    return get<GetQueueResult>(url);
  }

  /**
   * Performs a search for tracks
   * @param partyCode The code of the party
   * @param query The search query
   */
  export function searchTracks(
    partyCode: PartyCode,
    query: string
  ): Promise<SearchTracksResult> {
    const url = `parties/${partyCode}/search?${querystring.stringify({
      q: query,
    })}`;
    return get<SearchTracksResult>(url);
  }

  /**
   * Skips a parties playback forward or backward
   * @param partyCode The code of the party
   * @param direction The skip direction
   */
  export function skip(
    partyCode: PartyCode,
    direction: SkipDirection
  ): Promise<SkipResult> {
    const url = `parties/${partyCode}/player/skip?${querystring.stringify({
      direction,
    })}`;
    return get<SkipResult>(url);
  }

  /**
   * Removes a guest from a party
   * @param partyCode The code of the party
   * @param body The request body
   */
  export function removeGuest(
    partyCode: PartyCode,
    body: RemoveGuestBody
  ): Promise<RemoveGuestResult> {
    const url = `parties/${partyCode}/remove`;
    return post<RemoveGuestBody, RemoveGuestResult>(url, body);
  }
}
