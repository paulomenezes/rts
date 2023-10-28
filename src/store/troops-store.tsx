import { StateCreator } from 'zustand';
import { eventBus } from '../events/event-bus.ts';
import { TILE_SIZE } from '../util/const.ts';
import { moveTroops } from '../util/move-troops.ts';
import { PawnAnimation, TreeEntity, TroopEntity } from '../util/types.ts';
import { GameState, TroopsState } from './types.tsx';

export const createTroopsSlicer: StateCreator<
  GameState,
  [],
  [],
  TroopsState
> = (set) => ({
  troops: [
    {
      id: '1',
      selected: false,
      position: { x: 448, y: 7 * TILE_SIZE },
      animation: PawnAnimation.Idle,
    },
    {
      id: '2',
      selected: false,
      position: { x: 448 + TILE_SIZE, y: 7 * TILE_SIZE },
      animation: PawnAnimation.Idle,
    },
    {
      id: '3',
      selected: false,
      position: { x: 448 + TILE_SIZE * 2, y: 7 * TILE_SIZE },
      animation: PawnAnimation.Idle,
    },
    {
      id: '4',
      selected: false,
      position: { x: 448 + TILE_SIZE * 3, y: 7 * TILE_SIZE },
      animation: PawnAnimation.Idle,
    },
    {
      id: '5',
      selected: false,
      position: { x: 448 + TILE_SIZE * 4, y: 7 * TILE_SIZE },
      animation: PawnAnimation.Idle,
    },
  ],

  selectTroops: (position) =>
    set((state) => {
      const posX =
        Math.floor(position.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
      const posY =
        Math.floor(position.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;

      return {
        troops: state.troops.map((troop) => {
          if (
            posX >= troop.position.x &&
            posX <= troop.position.x + TILE_SIZE &&
            posY >= troop.position.y &&
            posY <= troop.position.y + TILE_SIZE
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

  selectAllTroopsWithSameType: (position) =>
    set((state) => {
      const posX =
        Math.floor(position.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
      const posY =
        Math.floor(position.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;

      const selectedTroop = state.troops.find((troop) => {
        return (
          posX >= troop.position.x &&
          posX <= troop.position.x + TILE_SIZE &&
          posY >= troop.position.y &&
          posY <= troop.position.y + TILE_SIZE
        );
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
      const left = Math.min(start.x, end.x);
      const top = Math.min(start.y, end.y);
      const width = Math.abs(start.x - end.x);
      const height = Math.abs(start.y - end.y);

      return {
        troops: state.troops.map((troop) => {
          if (
            left <= troop.position.x &&
            left + width >= troop.position.x + TILE_SIZE &&
            top <= troop.position.y &&
            top + height >= troop.position.y + TILE_SIZE
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
      // const newTreesBeingCut: Record<string, number> = {
      //   ...state.treesBeingCut,
      // };

      const newTroops: TroopEntity[] = [];

      for (const troop of state.troops) {
        // if (
        //   troop.path &&
        //   troop.pathIndex === troop.path.length - 1 &&
        //   troop.destinationAction === 'chop' &&
        //   troop.chopTreeId
        // ) {
        //   const key = troop.chopTreeId;

        //   if (newTreesBeingCut[key]) {
        //     newTreesBeingCut[key]++;
        //   } else {
        //     newTreesBeingCut[key] = 1;
        //   }
        // }

        if (troop.id === id) {
          if (troop.path && troop.pathIndex === troop.path.length - 1) {
            if (troop.destinationAction === 'chop') {
              eventBus.dispatch('start-cutting', { troop });
            }

            newTroops.push({
              ...troop,
              position,
              destination: undefined,
              path: undefined,
              animation:
                troop.destinationAction === 'chop'
                  ? PawnAnimation.Chop
                  : PawnAnimation.Idle,
            });
          } else {
            newTroops.push({
              ...troop,
              position,
              pathIndex: troop.pathIndex ? troop.pathIndex + 1 : 1,
            });
          }
        } else {
          newTroops.push(troop);
        }
      }

      return {
        // treesBeingCut: newTreesBeingCut,
        troops: newTroops,
      };
    }),

  moveSelectedTroops: (position) =>
    set((state) => {
      const troops = state.troops.filter((troop) => troop.selected);

      const newTroops = moveTroops(troops, position);

      return {
        troops: state.troops.map((troop) => {
          const newTroop = newTroops.find((t) => t.id === troop.id);

          if (troop.chopTreeId && !newTroop?.chopTreeId) {
            eventBus.dispatch('stop-cutting', { troop });
          }

          if (newTroop) {
            return newTroop;
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

  troopHitTree: (id, amount) =>
    set((state) => {
      const trees = state.trees;

      const currentTreeHealth =
        trees.find((tree) => tree.id === id)?.health ?? 0;

      return {
        troops: state.troops.map((troop) => {
          if (troop.chopTreeId === id && currentTreeHealth - amount <= 0) {
            let closestDistance = Infinity;
            let closestTree: TreeEntity | undefined;

            for (const tree of trees) {
              const x = tree.position.x * TILE_SIZE;
              const y = tree.position.y * TILE_SIZE;

              if (tree.health > 0) {
                const distance = Math.sqrt(
                  (troop.position.x - x) * (troop.position.x - x) +
                    (troop.position.y - y) * (troop.position.y - y),
                );

                if (distance < closestDistance) {
                  closestDistance = distance;
                  closestTree = tree;
                }
              }
            }

            if (closestTree) {
              return moveTroops([troop], {
                x: closestTree.position.x * TILE_SIZE,
                y: closestTree.position.y * TILE_SIZE,
              })[0];
            }

            return {
              ...troop,
              animation: PawnAnimation.Idle,
              chopTreeId: undefined,
              destinationAction: undefined,
            };
          }

          return troop;
        }),
      };
    }),
});
