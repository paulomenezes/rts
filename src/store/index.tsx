import { create } from 'zustand';
import { createBuildingSlice } from './buildings-slice.tsx';
import { createGlobalSlice } from './global-store.tsx';
import { createMapSlicer } from './map-store.tsx';
import { createResourceSlice } from './resource-slice.tsx';
import { createTroopsSlicer } from './troops-store.tsx';
import { GameState } from './types.tsx';

export const useGameStore = create<GameState>((...a) => ({
  ...createGlobalSlice(...a),
  ...createMapSlicer(...a),
  ...createTroopsSlicer(...a),
  ...createResourceSlice(...a),
  ...createBuildingSlice(...a),
}));
