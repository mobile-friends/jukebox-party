import { useEffect, useState } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize | null {
  const [windowSize, setWindowSize] = useState<WindowSize | null>(null);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    if (windowSize === null) handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [windowSize]);

  return windowSize;
}
