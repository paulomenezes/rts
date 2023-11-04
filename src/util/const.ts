export const TILE_SIZE = 64;
export const MAP_SIZE = 20;

export const CAMERA_MAP_OFFSET = 2;

export const Z_INDEX = {
  WATER: 1,
  WATER_FOAM: 2,
  WATER_ROCK: 3,
  DESERT: 10,
  GROUND: 20,

  MAP_DEBUG: 25,

  TREE: 30,
  RESOURCE: 30,
  TREE_DEBUG: 4000,

  ITEM_OFFSET: 100,

  TROOP: 40,

  MOUSE: 5000,
};

export const TILE_SIDES = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];

export function wallKey(x: number, y: number) {
  return `${x},${y}`;
}
