import { useGameStore } from '../store/index.tsx';
import { Position } from '../util/types.ts';

export function useHasTroopBehind(
  position: Position,
  {
    leftOffset = 0,
    rightOffset = 0,
    topOffset = 0,
  }: {
    leftOffset?: number;
    rightOffset?: number;
    topOffset?: number;
  },
) {
  return useGameStore((state) =>
    state.troops.some(
      (troop) =>
        troop.position.x >= position.x - leftOffset &&
        troop.position.x <= position.x + rightOffset &&
        troop.position.y >= position.y - topOffset &&
        troop.position.y <= position.y - 1,
    ),
  );
}
