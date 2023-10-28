import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useFrameTime } from './hooks/use-frame-time.tsx';
import { useGameStore } from './store/index.tsx';
import { Pawn } from './troops/pawn.tsx';

export const Game = memo(function Game() {
  const frameTime = useFrameTime();
  const troops = useGameStore(useShallow((state) => state.troops));

  return (
    <div>
      {troops.map((troop, index) => (
        <Pawn key={index} frameTime={frameTime} troop={troop} />
      ))}
    </div>
  );
});
