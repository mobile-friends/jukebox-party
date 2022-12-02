export function tryQueryParam(
  query: { [key: string]: string | string[] | undefined },
  key: string
): string | null {
  const param = query[key];
  if (param === undefined) {
    return null;
  } else if (Array.isArray(param)) {
    if (param.length >= 1) {
      return param[0];
    } else {
      return null;
    }
  } else {
    return param;
  }
}
