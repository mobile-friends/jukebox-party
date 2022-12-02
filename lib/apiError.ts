import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface MethodNotAllowedError {
  readonly code: HttpStatusCode.MethodNotAllowed;
  readonly message: string;
  readonly allowedMethods: string[];
}

interface ParamError {
  readonly code: HttpStatusCode.BadRequest;
  readonly message: string;
  readonly paramName: string;
}

type ApiError = MethodNotAllowedError | ParamError;

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
