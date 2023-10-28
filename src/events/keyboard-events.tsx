import { memo, useEffect } from 'react';
import { useGameStore } from '../store/index.tsx';

export const KeyboardEvents = memo(function KeyboardEvents() {
  const moveCamera = useGameStore((state) => state.moveCamera);
  const toggleDebug = useGameStore((state) => state.toggleDebug);
  const unselectAllTroops = useGameStore((state) => state.unselectAllTroops);

  useEffect(() => {
    function keyDownEvent(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        unselectAllTroops();
      }
      if (event.code === 'ArrowRight') {
        moveCamera('right');
      }
      if (event.code === 'ArrowLeft') {
        moveCamera('left');
      }
      if (event.code === 'ArrowUp') {
        moveCamera('up');
      }
      if (event.code === 'ArrowDown') {
        moveCamera('down');
      }
      if (event.code === 'Space') {
        toggleDebug();
      }
    }

    document.addEventListener('keydown', keyDownEvent);

    return () => {
      document.removeEventListener('keydown', keyDownEvent);
    };
  }, []);

  return null;
});
