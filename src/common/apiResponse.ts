import { StatusCodes } from 'http-status-codes';
import { NextApiResponse } from 'next';
import HTTPMethod from 'http-method-enum';
import { methodOf, urlOf } from '@src/common/apiUtil';
import { Dto } from '@src/common/dto';

export interface ApiError {
  kind: string;
  message: string;

  [key: string]: any;
}

interface ApiResponseBase {
  statusCode: StatusCodes;
  endpoint: string;
  usedMethod: HTTPMethod | null;
}

export type ApiSuccessResponse<TDto extends Dto> = ApiResponseBase & TDto;

export type ApiErrorResponse<TDto extends ApiError> = ApiResponseBase & TDto;

export type ApiResponse<TResult extends Dto, TError extends ApiError> =
  | ApiSuccessResponse<TResult>
  | ApiErrorResponse<TError>;

export function isErrorResponse<TResult extends ApiError>(
  response: ApiResponse<any, TResult>
): response is ApiErrorResponse<TResult> {
  return response.statusCode >= 400;
}

export function isSuccessResponse<TError extends Dto>(
  response: ApiResponse<TError, any>
): response is ApiSuccessResponse<TError> {
  return response.statusCode >= 100 && response.statusCode < 400;
}

function sendResponse<TResult extends Dto, TError extends ApiError>(
  res: NextApiResponse<ApiResponse<TResult, TError>>,
  response: ApiResponse<TResult, TError>
) {
  res.status(response.statusCode).json(response);
}

export function sendSuccess<TSuccess extends Dto>(
  res: NextApiResponse<ApiSuccessResponse<TSuccess>>,
  statusCode: StatusCodes,
  dto: TSuccess
) {
  sendResponse<TSuccess, never>(res, {
    statusCode,
    endpoint: urlOf(res.req),
    usedMethod: methodOf(res.req),
    ...dto,
  });
}

export function sendError<TError extends ApiError>(
  res: NextApiResponse<ApiErrorResponse<TError>>,
  statusCode: StatusCodes,
  error: TError
) {
  sendResponse<never, TError>(res, {
    statusCode,
    endpoint: urlOf(res.req),
    usedMethod: methodOf(res.req),
    ...error,
  });
}
