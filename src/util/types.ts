export type Position = {
  x: number;
  y: number;
};

export type TroopEntity = {
  id: string;
  selected: boolean;
  position: Position;
  animation: number;
  actionInProgress: boolean;
  carry?: 'wood' | 'gold' | 'meat';
  carryAmount: number;
  actions: TroopActionsEntity[];
};

export type TroopActionsEntity =
  | TroopActionsMoveEntity
  | TroopActionsChopEntity
  | TroopActionsResourceEntity;

export type TroopActionsMoveEntity = {
  destinationAction?: 'move';
  destination: Position;
  moveReason?: MOVE_REASON;
  path?: PathfindPoint[];
  pathIndex?: number;
};

export type TroopActionsChopEntity = {
  destinationAction?: 'chop';
  chopTreeId: string;
};

export type TroopActionsResourceEntity = {
  destinationAction?: 'resource';
  resourceId: string;
  carry: 'wood' | 'gold' | 'meat';
  // carryAmount: number;
};

export type TreeEntity = {
  id: string;
  position: Position;
  state: 'idle' | 'chopped';
  reachable: boolean;
  reachableDirection: 'left' | 'right' | 'both';
  health: number;
  troopsChopping: string[];
};

export type ResourceEntity = {
  id: string;
  position: Position;
  type: 'wood' | 'gold' | 'meat';
  willBeLoadedBy?: string;
  isBeingLoadedBy?: string;
};

export type BuildingEntity = {
  id: string;
  position: Position;
  type: 'castle';
};

export type DecorationEntity = {
  id: string;
  position: Position;
  block: boolean;
} & (DecorationEntityWater | DecorationEntityGround);

export type DecorationEntityGround = {
  place: 'ground';
  type: number;
};

export type DecorationEntityWater = {
  place: 'water';
  size: DECORATION_SIZES;
};

export type MOVE_REASON = 'delivery' | 'chop' | 'resource';

export type DECORATION_SIZES = '01' | '02' | '03' | '04';

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
