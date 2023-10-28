export type Position = {
  x: number;
  y: number;
};

export type TroopEntity = {
  id: string;
  selected: boolean;
  position: Position;
  destination?: Position;
  path?: PathfindPoint[];
  pathIndex?: number;
  animation: number;
  destinationAction?: 'chop';
  chopTreeId?: string;
};

export type TreeEntity = {
  id: string;
  position: Position;
  state: 'idle' | 'chopped';
  reachable: boolean;
  reachableDirection: 'left' | 'right';
  health: number;
};

export type MAP_TYPE = 'water' | 'desert' | 'ground';

export type PathfindPoint = {
  x: number;
  y: number;
  // total cost function
  f: number;
  // cost function from start to the current grid point
  g: number;
  // heuristic estimated cost function from current grid point to the goal
  h: number;
  // neighbors of the current grid point
  neighbors: PathfindPoint[];
  // immediate source of the current grid point
  parent?: PathfindPoint;
  type: MAP_TYPE;
};

export enum PawnAnimation {
  Idle = 0,
  Walk = 1,
  Build = 2,
  Chop = 3,
  CarryIdle = 4,
  CarryRun = 5,
}
