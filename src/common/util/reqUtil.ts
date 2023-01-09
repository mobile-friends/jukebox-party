import HTTPMethod from 'http-method-enum';
import http from 'http';

export function methodOf(req: http.IncomingMessage): HTTPMethod | null {
  const method = req.method;
  return method !== undefined ? (method as HTTPMethod) : null;
}
