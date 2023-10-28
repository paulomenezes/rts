import { useGameStore } from '../store/index.tsx';
import { MAP_TYPE } from '../util/types.ts';

export function border(
  type: MAP_TYPE,
  x: number,
  y: number,
  top?: boolean,
  right?: boolean,
  bottom?: boolean,
  left?: boolean,
) {
  const map = useGameStore.getState().map;

  return (
    ((top && map[x]?.[y - 1] === type) || (!top && map[x]?.[y - 1] !== type)) &&
    ((right && map[x + 1]?.[y] === type) ||
      (!right && map[x + 1]?.[y] !== type)) &&
    ((bottom && map[x]?.[y + 1] === type) ||
      (!bottom && map[x]?.[y + 1] !== type)) &&
    ((left && map[x - 1]?.[y] === type) || (!left && map[x - 1]?.[y] !== type))
  );
}

export function water(
  x: number,
  y: number,
  top?: boolean,
  right?: boolean,
  bottom?: boolean,
  left?: boolean,
) {
  return border('water', x, y, top, right, bottom, left);
}

export function desert(
  x: number,
  y: number,
  top?: boolean,
  right?: boolean,
  bottom?: boolean,
  left?: boolean,
) {
  return border('desert', x, y, top, right, bottom, left);
}
