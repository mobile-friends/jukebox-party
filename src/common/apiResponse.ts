import { StatusCodes } from 'http-status-codes';
import { NextApiResponse } from 'next';
import HTTPMethod from 'http-method-enum';
import { methodOf, urlOf } from '@src/common/apiUtil';
import { Dto } from '@src/common/dto';
import { Api } from '@firebase/performance/dist/src/services/api_service';

export interface ErrorDto {
  kind: string;
  message: string;

  [key: string]: any;
}

interface ApiResponseBase {
  statusCode: StatusCodes;
  endpoint: string;
  usedMethod: HTTPMethod | null;
}

export type ApiResponse<TDto extends Dto | ErrorDto> = ApiResponseBase & TDto;

export function isErrorResponse<
  TDto extends Dto | ErrorDto,
  TError extends ErrorDto
>(response: ApiResponse<TDto | TError>): response is ApiResponse<TError> {
  return response.statusCode >= 400;
}

export function isSuccessResponse<
  TDto extends Dto | ErrorDto,
  TSuccess extends Dto
>(response: ApiResponse<TDto | TSuccess>): response is ApiResponse<TSuccess> {
  return response.statusCode >= 100 && response.statusCode < 400;
}

function sendResponse<TDto extends Dto | ErrorDto>(
  res: NextApiResponse<ApiResponse<TDto>>,
  response: ApiResponse<TDto>
) {
  res.status(response.statusCode).json(response);
}

export function sendSuccess<TSuccess extends Dto>(
  res: NextApiResponse<ApiResponse<TSuccess>>,
  statusCode: StatusCodes,
  dto: TSuccess
) {
  sendResponse<TSuccess>(res, {
    statusCode,
    endpoint: urlOf(res.req),
    usedMethod: methodOf(res.req),
    ...dto,
  });
}

export function sendError<TError extends ErrorDto>(
  res: NextApiResponse<ApiResponse<TError>>,
  statusCode: StatusCodes,
  error: TError
) {
  sendResponse<TError>(res, {
    statusCode,
    endpoint: urlOf(res.req),
    usedMethod: methodOf(res.req),
    ...error,
  });
}
