import { NextApiRequest, NextApiResponse } from 'next';
import HTTPMethod from 'http-method-enum';
import http from 'http';
import {
  sendMethodNotAllowedError,
} from '@src/common/errors';
import { ApiError, ApiResponse } from '@src/common/apiResponse';
import { Dto } from '@src/common/dto';

type EndpointHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => void | Promise<void>;

type MethodHandlers = {
  [key in HTTPMethod]?: EndpointHandler;
};

export function methodOf(req: http.IncomingMessage): HTTPMethod | null {
  const method = req.method;
  return method !== undefined ? (method as HTTPMethod) : null;
}

export function urlOf(req: http.IncomingMessage): string {
  return req.url ?? 'Unknown url';
}

export function multiMethodHandler<TSuccess extends Dto>(
  handlers: MethodHandlers
): EndpointHandler<ApiResponse<TSuccess, ApiError>> {
  return (req, res) => {
    const method = methodOf(req);
    if (method !== null && method in handlers) {
      return handlers[method]!(req, res);
    } else {
      const allowedMethods = Object.keys(handlers) as HTTPMethod[];
      sendMethodNotAllowedError(res, allowedMethods);
    }
  };
}
