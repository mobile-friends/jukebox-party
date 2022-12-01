import { NextApiRequest } from 'next';

export function tryQueryParam(req: NextApiRequest, key: string): string | null {
  const param = req.query[key];
  return Array.isArray(param) ? (param.length >= 1 ? param[0] : null) : param;
}
