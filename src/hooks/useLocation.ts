export function useLocation() {
  if (window === undefined)
    throw new Error('Only call useLocation from the client-side!');
  return window.location;
}
