import { NextApiRequest, NextApiResponse } from 'next';
import { PartyCode } from './partyCode';

interface GenericError {
  readonly code: number;
  readonly message: string;
}

interface MethodNotAllowedError extends GenericError {
  readonly allowedMethods: string[];
}

interface ParamError extends GenericError {
  readonly paramName: string;
}

interface PartyNotFoundError extends GenericError {
  readonly partyCode: PartyCode;
}

type ApiError =
  | GenericError
  | MethodNotAllowedError
  | ParamError
  | PartyNotFoundError;

/**
 * An error the API can return to the user
 */
export type ApiErrorResponse = ApiError & {
  readonly endpoint: string;
  readonly usedMethod: string;
};

/**
 * Error for when a http-method is not allowed
 * @param allowedMethods The methods that are allowed on this endpoint
 */
export function methodNotAllowed(allowedMethods: string[]): ApiError {
  return {
    code: 405,
    message: 'You used a illegal http-method',
    allowedMethods,
  };
}

/**
 * Error for when a parameter is missing
 * @param paramName The missing parameter name
 */
export function missingParam(paramName: string): ApiError {
  return {
    code: 400,
    message: 'Your request is missing a required parameter',
    paramName,
  };
}

/**
 * Error for when a party-code parameter is malformed
 * @param partyCodeParam The parameter
 * @param paramName The name of the parameter
 */
export function invalidPartyCode(
  partyCodeParam: string,
  paramName: string
): ApiError {
  const message = `${partyCodeParam} is not a valid party-code`;
  return { code: 400, message, paramName };
}

/**
 * Error for when a party with a specific code could not be found
 * @param partyCode The party-code
 */
export function partyNotFound(partyCode: PartyCode): ApiError {
  const message = `Could not find a party with the code ${partyCode}`;
  return { code: 404, message, partyCode };
}

/**
 * Generic internal server error
 * @param message A message to describe the error
 */
export function internalError(message: string): ApiError {
  return { code: 500, message };
}

/**
 * Send an error in a response
 * @param req The request
 * @param res The response
 * @param error The error
 */
export function sendError(
  req: NextApiRequest,
  res: NextApiResponse,
  error: ApiError
) {
  const response: ApiErrorResponse = {
    endpoint: req.url ?? 'Unknown url',
    usedMethod: req.method ?? 'Unknown method',
    ...error,
  };
  res.status(response.code).json(response);
}

export function isApiErrorResult<T>(
  item: T | ApiErrorResponse
): item is ApiErrorResponse {
  return (
    item instanceof Object &&
    'code' in item &&
    'message' in item &&
    'endpoint' in item &&
    'usedMethod' in item
  );
}
