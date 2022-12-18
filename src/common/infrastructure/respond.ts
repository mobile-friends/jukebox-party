import { StatusCodes } from 'http-status-codes';
import {
  CodedResult,
  ErrorResult,
  SuccessResult,
} from '@common/infrastructure/types';
import HTTPMethod from 'http-method-enum';
import {
  DtoError,
  GenericServerError,
  MethodNotAllowedError,
  NoSpotifyError,
  NotImplementedError,
  PartyNotFoundError,
} from '@common/types/errors';
import { PartyCode } from '@common/types/partyCode';

export type SuccessStatusCode = StatusCodes.OK | StatusCodes.CREATED;

export type ErrorStatusCode =
  | StatusCodes.METHOD_NOT_ALLOWED
  | StatusCodes.BAD_REQUEST
  | StatusCodes.NOT_FOUND
  | StatusCodes.UNAUTHORIZED
  | StatusCodes.INTERNAL_SERVER_ERROR
  | StatusCodes.NOT_IMPLEMENTED;

function withSuccess<TSuccess extends SuccessResult>(
  result: TSuccess,
  code: SuccessStatusCode
): CodedResult<TSuccess> {
  return [result, code];
}

function withError<TError extends ErrorResult>(
  result: TError,
  code: ErrorStatusCode
): CodedResult<TError> {
  return [result, code];
}

export namespace Respond {
  export function withOk<TResult extends SuccessResult>(
    result: TResult
  ): CodedResult<TResult> {
    return withSuccess(result, StatusCodes.OK);
  }

  export function withCreated<TResult extends SuccessResult>(
    result: TResult
  ): CodedResult<TResult> {
    return withSuccess(result, StatusCodes.CREATED);
  }

  export function withMethodNotAllowedError(
    allowedMethods: HTTPMethod[]
  ): CodedResult<MethodNotAllowedError> {
    const error: MethodNotAllowedError = {
      kind: 'MethodNotAllowedError',
      message:
        'The request method is known by the server but has been disabled and cannot be used.',
      allowedMethods,
    };
    return withError(error, StatusCodes.METHOD_NOT_ALLOWED);
  }

  export function withMissingQueryParamError(
    paramName: string
  ): CodedResult<DtoError> {
    const error: DtoError = {
      kind: 'DtoError',
      message: 'Your request is missing a required query-parameter',
      paramName,
      location: 'query',
      issue: 'Missing',
    };
    return withError(error, StatusCodes.BAD_REQUEST);
  }

  export function withInvalidQueryParamError(
    paramName: string
  ): CodedResult<DtoError> {
    const error: DtoError = {
      kind: 'DtoError',
      message: 'Your request contains an invalid query-parameter',
      paramName,
      location: 'query',
      issue: 'Invalid',
    };
    return withError(error, StatusCodes.BAD_REQUEST);
  }

  export function withInvalidBodyError(
    paramName: string
  ): CodedResult<DtoError> {
    const error: DtoError = {
      kind: 'DtoError',
      message: 'Your request contains an invalid property in its body-dto',
      paramName,
      location: 'body',
      issue: 'Invalid',
    };
    return withError(error, StatusCodes.BAD_REQUEST);
  }

  export function withPartyNotFoundError(
    partyCode: PartyCode
  ): CodedResult<PartyNotFoundError> {
    const error: PartyNotFoundError = {
      kind: 'PartyNotFoundError',
      message: 'No party with the given code was found',
      partyCode,
    };
    return withError(error, StatusCodes.NOT_FOUND);
  }

  export function withGenericServerError(
    message: string = 'Internal server error'
  ): CodedResult<GenericServerError> {
    const error: GenericServerError = {
      kind: 'Generic',
      message,
    };
    return withError(error, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  export function withNoSpotifyError(): CodedResult<NoSpotifyError> {
    const error: NoSpotifyError = {
      kind: 'NoSpotifyError',
      message: 'You are not logged in to Spotify.',
    };
    return withError(error, StatusCodes.UNAUTHORIZED);
  }

  export function withNotImplementedError(): CodedResult<NotImplementedError> {
    const error: NotImplementedError = {
      kind: 'NotImplementedError',
      message: 'An operation is not yet implemented.',
    };
    return withError(error, StatusCodes.NOT_IMPLEMENTED);
  }
}
