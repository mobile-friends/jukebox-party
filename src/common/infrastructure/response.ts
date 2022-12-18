import {
  ApiResponse,
  ErrorResult,
  SuccessResult,
} from '@common/infrastructure/types';
import { StatusCodes } from 'http-status-codes';
import {
  ErrorStatusCode,
  SuccessStatusCode,
} from '@common/infrastructure/respond';

export function isSuccessCode(code: StatusCodes): code is SuccessStatusCode {
  return code < 400;
}

export function isErrorCode(code: StatusCodes): code is ErrorStatusCode {
  return code >= 400;
}

export function isSuccess<TSuccess extends SuccessResult>(
  response: ApiResponse<TSuccess | ErrorResult>
): response is ApiResponse<TSuccess> {
  return isSuccessCode(response.statusCode);
}

export function isError<TError extends ErrorResult>(
  response: ApiResponse<SuccessResult | TError>
): response is ApiResponse<TError> {
  return isErrorCode(response.statusCode);
}
