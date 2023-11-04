import { StateCreator } from 'zustand';
import { createActionsAfterCutTree } from '../actions/create-actions-after-cut-tree.ts';
import { createActionsFromUserInput } from '../actions/create-actions-from-user-input.ts';
import { doAction } from '../troops/actions.tsx';
import { PawnAnimation } from '../util/types.ts';
import { GameState, TroopsState } from './types.tsx';

export const createTroopsSlicer: StateCreator<
  GameState,
  [],
  [],
  TroopsState
> = (set) => ({
  troops: Array.from({ length: 20 }).map((_, i) => ({
    id: i.toString(),
    selected: false,
    position: { x: 3, y: 3 },
    animation: PawnAnimation.Idle,
    actionInProgress: false,
    actions: [],
    carryAmount: 0,
  })),

  selectTroops: (position) =>
    set((state) => {
      const posX = Math.floor(position.x);
      const posY = Math.floor(position.y);

      return {
        troops: state.troops.map((troop) => {
          if (posX === troop.position.x && posY === troop.position.y) {
            return {
              ...troop,
              selected: true,
            };
          }

          return { ...troop, selected: false };
        }),
      };
    }),

  selectAllTroopsWithSameType: (position) =>
    set((state) => {
      const posX = Math.floor(position.x);
      const posY = Math.floor(position.y);

      const selectedTroop = state.troops.find((troop) => {
        return posX === troop.position.x && posY === troop.position.y;
      });

      if (selectedTroop) {
        return {
          troops: state.troops.map((troop) => {
            // TODO: filter only the same type of troop
            return {
              ...troop,
              selected: true,
            };
          }),
        };
      }

      return state;
    }),

  selectTroopsByArea: (start, end) =>
    set((state) => {
      const left = Math.floor(Math.min(start.x, end.x));
      const top = Math.floor(Math.min(start.y, end.y));
      const width = Math.floor(Math.abs(start.x - end.x));
      const height = Math.floor(Math.abs(start.y - end.y));

      return {
        troops: state.troops.map((troop) => {
          if (
            left <= troop.position.x &&
            left + width >= troop.position.x &&
            top <= troop.position.y &&
            top + height >= troop.position.y
          ) {
            return {
              ...troop,
              selected: true,
            };
          }

          return { ...troop, selected: false };
        }),
      };
    }),

  setTroopPosition: (id, position) =>
    set((state) => {
      return {
        troops: state.troops.map((troop) =>
          troop.id === id ? doAction({ ...troop, position }) : troop,
        ),
      };
    }),

  moveSelectedTroops: (position) =>
    set((state) => {
      position.x = Math.floor(position.x);
      position.y = Math.floor(position.y);

      return {
        troops: state.troops.map((troop) => {
          if (troop.selected) {
            return createActionsFromUserInput(troop, position);
          }

          return troop;
        }),
      };
    }),

  unselectAllTroops: () =>
    set((state) => ({
      troops: state.troops.map((troop) => ({
        ...troop,
        selected: false,
      })),
    })),

  cutTree: (id) =>
    set((state) => {
      return {
        troops: state.troops.map((troop) => {
          const action = troop.actions.at(0);

          if (
            action?.destinationAction === 'chop' &&
            action.chopTreeId === id
          ) {
            return createActionsAfterCutTree(troop, id);
          }

          return troop;
        }),
      };
    }),
});
