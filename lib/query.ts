export function tryQueryParam(
  query: { [key: string]: string | string[] },
  key: string
): string | null {
  const param = query[key];
  return Array.isArray(param) ? (param.length >= 1 ? param[0] : null) : param;
}
