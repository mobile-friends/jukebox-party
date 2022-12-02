import { HttpStatusCode } from 'axios';
import { NextApiResponse } from 'next';

interface ApiErrorBase {
  readonly code: HttpStatusCode;
  readonly endpoint: string;
  readonly message: string;
  readonly usedMethod: string;
}

/**
 * An error for when a http-method is not allowed
 */
export interface MethodNotAllowedError extends ApiErrorBase {
  readonly code: HttpStatusCode.MethodNotAllowed;
  readonly allowedMethods: string[];
}

/**
 * An error for when a required query-parameter is missing
 */
export interface MissingQueryParamError extends ApiErrorBase {
  readonly code: HttpStatusCode.BadRequest;
  readonly paramName: string;
}

/**
 * An error the API can return to the user
 */
export type ApiError = MethodNotAllowedError | MissingQueryParamError;

/**
 * Creates a MethodNotAllowedError error
 * @param endpoint The endpoint that was accessed
 * @param usedMethod The incorrect method that was used
 * @param allowedMethods The methods that are allowed on this endpoint
 */
export function methodNotAllowed(
  endpoint: string,
  usedMethod: string | undefined,
  allowedMethods: string[]
): ApiError {
  return {
    code: HttpStatusCode.MethodNotAllowed,
    endpoint,
    message: 'Method is not allowed',
    usedMethod: usedMethod ?? 'Unknown',
    allowedMethods,
  };
}

/**
 * Creates a MissingQueryParamError error
 * @param endpoint The endpoint that was accessed
 * @param usedMethod The method that was used
 * @param paramName The missing parameter name
 */
export function missingQueryParam(
  endpoint: string,
  usedMethod: string | undefined,
  paramName: string
): ApiError {
  return {
    code: HttpStatusCode.BadRequest,
    endpoint,
    message: 'Your request was missing a required query parameter',
    usedMethod: usedMethod ?? 'Unknown',
    paramName,
  };
}

/**
 * Send an error in a response
 * @param res The response
 * @param error The error
 */
export function sendError(res: NextApiResponse, error: ApiError) {
  res.status(error.code).json(error);
}
