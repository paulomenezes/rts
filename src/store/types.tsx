import {
  DecorationEntity,
  MAP_TYPE,
  Position,
  TreeEntity,
  TroopEntity,
} from '../util/types.ts';

export type GameState = GlobalState & MapState & TroopsState;

export interface GlobalState {
  debug: boolean;
  cameraPosition: Position;
  tilesOnScreen: Position;

  moveCamera: (direction: 'resize' | 'up' | 'down' | 'left' | 'right') => void;
  toggleDebug: () => void;
}

export interface MapState {
  map: MAP_TYPE[][];
  trees: TreeEntity[];
  walls: Record<string, boolean>;
  decorations: Record<string, DecorationEntity>;

  chopTree: (id: string) => void;
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
