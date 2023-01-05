export function useWindowSize() {
    if (window === undefined)
      throw new Error('Only call useLocation from the client-side!');
    return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
  }
  