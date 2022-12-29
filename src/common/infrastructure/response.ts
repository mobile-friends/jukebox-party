import { StatusCodes } from 'http-status-codes';
import {
  Created,
  DtoError,
  MethodNotAllowedError,
  NoContent,
  NoSpotifyError,
  NotImplementedError,
  Ok,
  PartyNotFoundError,
  ResponseData,
} from '@common/infrastructure/types';
import HTTPMethod from 'http-method-enum';
import { PartyCode } from '@common/types/partyCode';

export namespace Response {
  export function ok<T extends ResponseData>(content: T): Ok<T> {
    return { code: StatusCodes.OK, content };
  }

  export function created<T extends ResponseData>(content: T): Created<T> {
    return { code: StatusCodes.CREATED, content };
  }

  export function noContent(): NoContent {
    return { code: StatusCodes.NO_CONTENT };
  }

  export function methodNotAllowed(
    allowedMethods: HTTPMethod[]
  ): MethodNotAllowedError {
    return {
      code: StatusCodes.METHOD_NOT_ALLOWED,
      error: {
        kind: 'MethodNotAllowedError',
        message:
          'The request method is known by the server but has been disabled and cannot be used.',
        allowedMethods,
      },
    };
  }

  export function missingQueryParam(paramName: string): DtoError {
    return {
      code: StatusCodes.BAD_REQUEST,
      error: {
        kind: 'DtoError',
        message: 'Your request is missing a required query-parameter',
        paramName,
        location: 'query',
        issue: 'Missing',
      },
    };
  }

  export function invalidQueryParam(paramName: string): DtoError {
    return {
      code: StatusCodes.BAD_REQUEST,
      error: {
        kind: 'DtoError',
        message: 'Your request contains an invalid query-parameter',
        paramName,
        location: 'query',
        issue: 'Invalid',
      },
    };
  }

  export function invalidBody(paramName: string): DtoError {
    return {
      code: StatusCodes.BAD_REQUEST,
      error: {
        kind: 'DtoError',
        message: 'Your request contains an invalid property in its body-dto',
        paramName,
        location: 'body',
        issue: 'Invalid',
      },
    };
  }

  export function partyNotFound(partyCode: PartyCode): PartyNotFoundError {
    return {
      code: StatusCodes.NOT_FOUND,
      error: {
        kind: 'PartyNotFoundError',
        message: 'No party with the given code was found',
        partyCode,
      },
    };
  }

  export function noSpotify(): NoSpotifyError {
    return {
      code: StatusCodes.UNAUTHORIZED,
      error: {
        kind: 'NoSpotifyError',
        message: 'You are not logged in to Spotify.',
      },
    };
  }

  export function notImplemented(
    message: string = 'An operation is not yet implemented.'
  ): NotImplementedError {
    return {
      code: StatusCodes.NOT_IMPLEMENTED,
      error: {
        kind: 'NotImplementedError',
        message,
      },
    };
  }
}
