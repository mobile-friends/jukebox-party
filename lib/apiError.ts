import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * An error for when a http-method is not allowed
 */
export interface MethodNotAllowedError {
  readonly code: HttpStatusCode.MethodNotAllowed;
  readonly message: string;
  readonly allowedMethods: string[];
}

/**
 * An error for when a required query-parameter is missing
 */
export interface MissingQueryParamError {
  readonly code: HttpStatusCode.BadRequest;
  readonly message: string;
  readonly paramName: string;
}

type ApiError = MethodNotAllowedError | MissingQueryParamError;
/**
 * An error the API can return to the user
 */
export type ApiErrorResponse = ApiError & {
  readonly endpoint: string;
  readonly usedMethod: string;
};

/**
 * Creates a MethodNotAllowedError error
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
 * Creates a MissingQueryParamError error
 * @param paramName The missing parameter name
 */
export function missingQueryParam(paramName: string): ApiError {
  return {
    code: HttpStatusCode.BadRequest,
    message: 'Your request is missing a required query-parameter',
    paramName,
  };
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
