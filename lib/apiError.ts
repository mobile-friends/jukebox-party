import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { PartyCode } from './partyCode';

interface ErrorBase {
  readonly code: HttpStatusCode;
  readonly message: string;
}

interface MethodNotAllowedError extends ErrorBase {
  readonly allowedMethods: string[];
}

interface ParamError extends ErrorBase {
  readonly paramName: string;
}

interface PartyNotFoundError extends ErrorBase {
  readonly partyCode: PartyCode;
}

type ApiError = MethodNotAllowedError | ParamError | PartyNotFoundError;

/**
 * An error the API can return to the user
 */
type ApiErrorResponse = ApiError & {
  readonly endpoint: string;
  readonly usedMethod: string;
};

/**
 * Error for when a http-method is not allowed
 * @param allowedMethods The methods that are allowed on this endpoint
 */
export function methodNotAllowed(allowedMethods: string[]): ApiError {
  return {
    code: HttpStatusCode.MethodNotAllowed,
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
    code: HttpStatusCode.BadRequest,
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
  return { code: HttpStatusCode.BadRequest, message, paramName };
}

/**
 * Error for when a party with a specific code could not be found
 * @param partyCode The party-code
 */
export function partyNotFound(partyCode: PartyCode): ApiError {
  const message = `Could not find a party with the code ${partyCode}`;
  return { code: HttpStatusCode.NotFound, message, partyCode };
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
