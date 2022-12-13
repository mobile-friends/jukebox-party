import { ApiError, ApiErrorResponse, sendError } from '@src/common/apiResponse';
import HTTPMethod from 'http-method-enum';
import { NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { PartyCode } from '@src/lib/partyCode';

export interface MethodNotAllowedError extends ApiError {
  allowedMethods: HTTPMethod[];
  kind: 'MethodNotAllowedError';
}

export interface DtoError extends ApiError {
  paramName: string;
  location: 'query' | 'body';
  issue: 'Missing' | 'Invalid';
  kind: 'DtoError';
}

export interface GenericServerError extends ApiError {
  kind: 'Generic';
}

export interface PartyNotFoundError extends ApiError {
  partyCode: PartyCode;
  kind: 'PartyNotFoundError';
}

export function sendMethodNotAllowedError(
  res: NextApiResponse<ApiErrorResponse<MethodNotAllowedError>>,
  allowedMethods: HTTPMethod[]
) {
  sendError(res, StatusCodes.METHOD_NOT_ALLOWED, {
    kind: 'MethodNotAllowedError',
    message: 'Your request used a non-allowed method',
    allowedMethods,
  });
}

export function sendMissingQueryParamError(
  res: NextApiResponse<ApiErrorResponse<DtoError>>,
  paramName: string
) {
  sendError(res, StatusCodes.BAD_REQUEST, {
    kind: 'DtoError',
    message: 'Your request is missing a required query-parameter',
    paramName,
    location: 'query',
    issue: 'Missing',
  });
}

export function sendInvalidQueryParamError(
  res: NextApiResponse<ApiErrorResponse<DtoError>>,
  paramName: string
) {
  sendError(res, StatusCodes.BAD_REQUEST, {
    kind: 'DtoError',
    message: 'Your request contains an invalid query-parameter',
    paramName,
    location: 'query',
    issue: 'Invalid',
  });
}

export function sendInvalidBodyError(
  res: NextApiResponse<ApiErrorResponse<DtoError>>,
  paramName: string
) {
  sendError(res, StatusCodes.BAD_REQUEST, {
    kind: 'DtoError',
    message: 'Your request contains an invalid property in its body-dto',
    paramName,
    location: 'body',
    issue: 'Invalid',
  });
}

export function sendPartyNotFoundError(
  res: NextApiResponse<ApiErrorResponse<PartyNotFoundError>>,
  partyCode: PartyCode
) {
  sendError(res, StatusCodes.NOT_FOUND, {
    kind: 'PartyNotFoundError',
    message: 'No party with the given code was found',
    partyCode,
  });
}

export function sendGenericServerError(
  res: NextApiResponse<ApiErrorResponse<GenericServerError>>,
  message: string = 'Internal server error'
) {
  sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, {
    kind: 'Generic',
    message,
  });
}
