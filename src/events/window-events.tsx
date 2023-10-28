import { memo, useLayoutEffect } from 'react';
import { useGameStore } from '../store/index.tsx';

export const WindowEvents = memo(function WindowEvents() {
  const moveCamera = useGameStore((state) => state.moveCamera);

  useLayoutEffect(() => {
    function resizeEvent() {
      moveCamera('resize');
    }

    window.addEventListener('resize', resizeEvent);

    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, []);

  return null;
});
