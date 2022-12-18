import HTTPMethod from 'http-method-enum';
import {
  ErrorStatusCode,
  SuccessStatusCode,
} from '@common/infrastructure/respond';

export interface ErrorResult {
  kind: string;
  message: string;

  [tag: symbol]: 'Error';
}

export interface SuccessResult {
  [tag: symbol]: 'Success';
}

export type ApiResult = SuccessResult | ErrorResult;

export type CodedResult<TResult extends ApiResult> = [
  TResult,
  SuccessStatusCode | ErrorStatusCode
];

export interface SuccessResponse<TResult extends SuccessResult> {
  statusCode: SuccessStatusCode;
  endpoint: string;
  method: HTTPMethod | 'Unknown method';
  data: TResult;
}

export interface ErrorResponse<TResult extends ErrorResult> {
  statusCode: ErrorStatusCode;
  endpoint: string;
  method: HTTPMethod | 'Unknown method';
  data: TResult;
}

export type ApiResponse<TResult extends ApiResult> =
  TResult extends SuccessResult
    ? SuccessResponse<TResult>
    : TResult extends ErrorResult
    ? ErrorResponse<TResult>
    : never;
