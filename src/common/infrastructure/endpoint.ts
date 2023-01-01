import HTTPMethod from 'http-method-enum';
import { NextApiHandler } from 'next';
import { ApiResult, MethodNotAllowedError } from '@common/infrastructure/types';
import { methodOf } from '@common/util/reqUtil';
import { requestHandler } from '@common/infrastructure/requestHandler';
import { Response } from '@common/infrastructure/response';

type MethodHandlers = {
  [key in HTTPMethod]?: NextApiHandler<ApiResult>;
};

function notAllowedMethodHandler(allowedMethods: HTTPMethod[]) {
  return requestHandler<never, MethodNotAllowedError>(() => {
    return Response.methodNotAllowed(allowedMethods);
  });
}

export function endpoint(handlers: MethodHandlers): NextApiHandler<ApiResult> {
  return async (req, res) => {
    const method = methodOf(req);
    const allowedMethods = Object.keys(handlers) as HTTPMethod[];
    const handler =
      (method !== null && handlers[method]) ||
      notAllowedMethodHandler(allowedMethods);
    await handler(req, res);
  };
}
