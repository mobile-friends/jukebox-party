import HTTPMethod from 'http-method-enum';
import { PartyCode } from '@common/types/partyCode';
import { ErrorResult } from '@common/infrastructure/types';

export interface MethodNotAllowedError extends ErrorResult {
  allowedMethods: HTTPMethod[];
  kind: 'MethodNotAllowedError';
}

export interface NoSpotifyError extends ErrorResult {
  kind: 'NoSpotifyError';
}

export interface NotImplementedError extends ErrorResult {
  kind: 'NotImplementedError';
}

export interface DtoError extends ErrorResult {
  paramName: string;
  location: 'query' | 'body';
  issue: 'Missing' | 'Invalid';
  kind: 'DtoError';
}

export interface GenericServerError extends ErrorResult {
  kind: 'Generic';
}

export interface PartyNotFoundError extends ErrorResult {
  partyCode: PartyCode;
  kind: 'PartyNotFoundError';
}
