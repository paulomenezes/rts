import { useGameStore } from '../store/index.tsx';
import { MAP_SIZE, wallKey } from './const.ts';
import { Position, TroopEntity } from './types.ts';

export function calculateMoveOffset(
  troop: TroopEntity,
  position: Position,
): Position {
  const troops = useGameStore.getState().troops;
  const selectedTroops = troops.filter((troop) => troop.selected);

  const threshold = Math.floor(Math.sqrt(selectedTroops.length) / 2);
  let x = -threshold;
  let y = x;

  for (let i = 0; i < selectedTroops.length; i++) {
    const selectedTroop = selectedTroops[i];

    const setX = position.x + x;
    const setY = position.y + y;

    if (
      !useGameStore.getState().walls[wallKey(setX, setY)] &&
      setX >= 0 &&
      setY >= 0 &&
      setX < MAP_SIZE &&
      setY < MAP_SIZE &&
      selectedTroop.id === troop.id
    ) {
      return { x, y };
    }

    x++;

    if (x > threshold) {
      x = -threshold;
      y++;
    }
  }

  return {
    x: 0,
    y: 0,
  };
}
