import {
  BuildingEntity,
  DecorationEntity,
  MAP_TYPE,
  Position,
  ResourceEntity,
  TreeEntity,
  TroopEntity,
} from '../util/types.ts';

export type GameState = GlobalState &
  MapState &
  TroopsState &
  ResourceState &
  BuildingState;

export interface GlobalState {
  debug: boolean;
  cameraPosition: Position;
  tilesOnScreen: Position;

  moveCamera: (direction: 'resize' | 'up' | 'down' | 'left' | 'right') => void;
  toggleDebug: () => void;
}

export interface ResourceState {
  resources: ResourceEntity[];
  addResource: (troopId: string, position: Position) => void;
  updateResource: (id: string, newResource: Partial<ResourceEntity>) => void;
  removeResources: (ids: string[]) => void;
}

export interface BuildingState {
  buildings: BuildingEntity[];
}

export interface MapState {
  map: MAP_TYPE[][];
  trees: TreeEntity[];
  troopsChoppingTrees: Record<string, string[]>;
  walls: Record<string, boolean>;
  decorations: Record<string, DecorationEntity>;

  addTroopToChopTree: (troopId: string, treeId: string) => void;
  removeTroopToChopTree: (troopId: string, treeId: string) => void;
  chopTree: (id: string) => void;
  removeTree: (id: string) => void;
}

export interface TroopsState {
  troops: TroopEntity[];
  selectTroops: (position: Position) => void;
  selectAllTroopsWithSameType: (position: Position) => void;
  selectTroopsByArea: (start: Position, end: Position) => void;
  setTroopPosition: (id: string, position: Position) => void;
  moveSelectedTroops: (position: Position) => void;
  unselectAllTroops: () => void;

  cutTree: (id: string) => void;
}
