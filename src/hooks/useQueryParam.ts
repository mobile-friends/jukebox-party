import { useRouter } from 'next/router';
import { tryQueryParam } from '@common/util/query';
import { useEffect, useState } from 'react';

export const routerNotReady = Symbol();

export type RouterNotReady = typeof routerNotReady;

export type UseQueryParamState = string | null | RouterNotReady;

/**
 * Gets a query-param from the pages url.
 * Returns routerNotReady on the server-side or while the page is still initializing
 * @param key The key to search for in the url
 */
export default function useQueryParam(key: string): UseQueryParamState {
  const router = useRouter();
  const [param, setParam] = useState<UseQueryParamState>(routerNotReady);
  useEffect(() => {
    if (router.isReady) setParam(tryQueryParam(router.query, key));
  }, [router.isReady, key]);

  return param;
}
