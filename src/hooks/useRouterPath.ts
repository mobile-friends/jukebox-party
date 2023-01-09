import { useRouter } from 'next/router';

export function useRouterPath(): string {
  const router = useRouter();
  return router.asPath.split('?')[0];
}
