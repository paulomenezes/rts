import { StateCreator } from 'zustand';
import { MAP_SIZE, TILE_SIZE } from '../util/const.ts';
import { GameState, GlobalState } from './types.tsx';

export const createGlobalSlice: StateCreator<GameState, [], [], GlobalState> = (
  set,
) => ({
  debug: false,

  cameraPosition: {
    x: 0,
    y: 0,
  },

  tilesOnScreen: {
    x: window.innerWidth / TILE_SIZE,
    y: window.innerHeight / TILE_SIZE,
  },

  moveCamera: (direction) =>
    set((state) => {
      const cameraPosition = { ...state.cameraPosition };
      const horizontalTiles = window.innerWidth / TILE_SIZE;
      const verticalTiles = window.innerHeight / TILE_SIZE;

      if (direction === 'right') {
        cameraPosition.x = Math.max(
          cameraPosition.x - 1,
          -(MAP_SIZE - horizontalTiles),
        );
      } else if (direction === 'left') {
        cameraPosition.x = Math.min(0, cameraPosition.x + 1);
      } else if (direction === 'up') {
        cameraPosition.y = Math.min(0, cameraPosition.y + 1);
      } else if (direction === 'down') {
        cameraPosition.y = Math.max(
          cameraPosition.y - 1,
          -(MAP_SIZE - verticalTiles),
        );
      } else if (direction === 'resize') {
        cameraPosition.x = Math.max(
          cameraPosition.x,
          -(MAP_SIZE - horizontalTiles),
        );
        cameraPosition.y = Math.max(
          cameraPosition.y,
          -(MAP_SIZE - verticalTiles),
        );
      }

      return {
        cameraPosition,
        tilesOnScreen: {
          x: horizontalTiles,
          y: verticalTiles,
        },
      };
    }),
  toggleDebug: () =>
    set((state) => ({
      debug: !state.debug,
    })),
});
