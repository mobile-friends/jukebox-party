import { StatusCodes } from 'http-status-codes';
import HTTPMethod from 'http-method-enum';
import { PartyCode } from '@common/types/partyCode';

export type ResponseData = Record<string, any>;

type MakeError<
  TCode extends StatusCodes,
  TKind extends string,
  TData extends ResponseData = {}
> = {
  code: TCode;
  error: { kind: TKind; message: string } & TData;
};

export interface Ok<T extends ResponseData> {
  code: StatusCodes.OK;
  content: T;
}

export interface Created<T extends ResponseData> {
  code: StatusCodes.CREATED;
  content: T;
}

export interface NoContent {
  code: StatusCodes.NO_CONTENT;
}

export type MethodNotAllowedError = MakeError<
  StatusCodes.METHOD_NOT_ALLOWED,
  'MethodNotAllowedError',
  {
    allowedMethods: HTTPMethod[];
  }
>;

export type NoSpotifyError = MakeError<
  StatusCodes.UNAUTHORIZED,
  'NoSpotifyError'
>;

export type NotImplementedError = MakeError<
  StatusCodes.NOT_IMPLEMENTED,
  'NotImplementedError'
>;

export type DtoError = MakeError<
  StatusCodes.BAD_REQUEST,
  'DtoError',
  {
    paramName: string;
    location: 'query' | 'body';
    issue: 'Missing' | 'Invalid';
  }
>;

export type PartyNotFoundError = MakeError<
  StatusCodes.NOT_FOUND,
  'PartyNotFoundError',
  { partyCode: PartyCode }
>;

export type SuccessResult = Ok<any> | Created<any> | NoContent;

export type SuccessCodes = SuccessResult['code'];

export type ErrorResult =
  | MethodNotAllowedError
  | NoSpotifyError
  | NotImplementedError
  | DtoError
  | PartyNotFoundError;

export type ErrorCodes = ErrorResult['code'];

export type ApiResult = SuccessResult | ErrorResult;
