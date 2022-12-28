import HTTPMethod from 'http-method-enum';
import { NextApiHandler } from 'next';
import { ApiResponse, ApiResult } from '@common/infrastructure/types';
import { methodOf } from '@common/util/reqUtil';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Respond } from '@common/infrastructure/respond';
import { MethodNotAllowedError } from '@common/infrastructure/errors';

type MethodHandlers = {
  [key in HTTPMethod]?: NextApiHandler<ApiResponse<ApiResult>>;
};

function notAllowedMethodHandler(allowedMethods: HTTPMethod[]) {
  return requestHandler<any, MethodNotAllowedError>((req) => {
    return Respond.withMethodNotAllowedError(allowedMethods);
  });
}

export function endpoint(
  handlers: MethodHandlers
): NextApiHandler<ApiResponse<ApiResult>> {
  return async (req, res) => {
    const method = methodOf(req);
    const allowedMethods = Object.keys(handlers) as HTTPMethod[];
    const handler =
      method !== null && allowedMethods.includes(method)
        ? handlers[method]!
        : notAllowedMethodHandler(allowedMethods);
    await handler(req, res);
  };
}
