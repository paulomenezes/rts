import { create } from 'zustand';
import { createGlobalSlice } from './global-store.tsx';
import { createMapSlicer } from './map-store.tsx';
import { createTroopsSlicer } from './troops-store.tsx';
import { GameState } from './types.tsx';

export const useGameStore = create<GameState>((...a) => ({
  ...createGlobalSlice(...a),
  ...createMapSlicer(...a),
  ...createTroopsSlicer(...a),
}));
