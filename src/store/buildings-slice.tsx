import { StateCreator } from 'zustand';
import { uuid } from '../util/functions.ts';
import { BuildingState, GameState } from './types.tsx';

export const createBuildingSlice: StateCreator<
  GameState,
  [],
  [],
  BuildingState
> = (set) => ({
  buildings: [
    {
      id: uuid(),
      position: {
        x: 7,
        y: 7,
      },
      type: 'castle',
    },
  ],
});
