import { ApiResponse, ErrorDto, sendError } from '@src/common/apiResponse';
import HTTPMethod from 'http-method-enum';
import { NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { PartyCode } from '@src/lib/partyCode';

export interface MethodNotAllowedError extends ErrorDto {
  allowedMethods: HTTPMethod[];
  kind: 'MethodNotAllowedError';
}

export interface DtoError extends ErrorDto {
  paramName: string;
  location: 'query' | 'body';
  issue: 'Missing' | 'Invalid';
  kind: 'DtoError';
}

export interface GenericServerError extends ErrorDto {
  kind: 'Generic';
}

export interface PartyNotFoundError extends ErrorDto {
  partyCode: PartyCode;
  kind: 'PartyNotFoundError';
}

export function sendMethodNotAllowedError(
  res: NextApiResponse<ApiResponse<MethodNotAllowedError>>,
  allowedMethods: HTTPMethod[]
) {
  sendError(res, StatusCodes.METHOD_NOT_ALLOWED, {
    kind: 'MethodNotAllowedError',
    message: 'Your request used a non-allowed method',
    allowedMethods,
  });
}

export function sendMissingQueryParamError(
  res: NextApiResponse<ApiResponse<DtoError>>,
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
  res: NextApiResponse<ApiResponse<DtoError>>,
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
  res: NextApiResponse<ApiResponse<DtoError>>,
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
  res: NextApiResponse<ApiResponse<PartyNotFoundError>>,
  partyCode: PartyCode
) {
  sendError(res, StatusCodes.NOT_FOUND, {
    kind: 'PartyNotFoundError',
    message: 'No party with the given code was found',
    partyCode,
  });
}

export function sendGenericServerError(
  res: NextApiResponse<ApiResponse<GenericServerError>>,
  message: string = 'Internal server error'
) {
  sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, {
    kind: 'Generic',
    message,
  });
}
