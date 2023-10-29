import { StateCreator } from 'zustand';
import { updateTree } from '../map/tree-utils.ts';
import { MAP_SIZE, wallKey } from '../util/const.ts';
import { random, uuid } from '../util/functions.ts';
import { perlinNoise } from '../util/noise.ts';
import { DecorationEntity, MAP_TYPE, TreeEntity } from '../util/types.ts';
import { GameState, MapState } from './types.tsx';

const mapSeed = perlinNoise.seed(1);
const treeSeed = perlinNoise.seed(2);

const map: MAP_TYPE[][] = [];
const trees: TreeEntity[] = [];

const walls: Record<string, boolean> = {};

const decorations: Record<string, DecorationEntity> = {};

for (let x = 0; x < MAP_SIZE; x++) {
  const row: MAP_TYPE[] = [];

  for (let y = 0; y < MAP_SIZE; y++) {
    const noise = perlinNoise.perlin2(mapSeed, x / 10, y / 10);
    const treeNoise = perlinNoise.perlin2(treeSeed, x / 10, y / 10);
    const type = noise < -0.2 ? 'water' : noise < 0 ? 'desert' : 'ground';

    row.push(type);

    if (treeNoise > 0.1 && type === 'ground') {
      trees.push({
        id: uuid(),
        position: {
          x,
          y,
        },
        state: 'idle',
        reachable: false,
        reachableDirection: 'left',
        health: 100,
      });

      walls[wallKey(x, y)] = true;
    }

    if (type !== 'water' && !walls[wallKey(x, y)]) {
      if (Math.random() < 0.01) {
        const type = random(1, 18);

        decorations[wallKey(x, y)] = {
          id: uuid(),
          position: {
            x,
            y,
          },
          place: 'ground',
          block: false,
          type,
        };

        if (type >= 16) {
          walls[wallKey(x, y)] = true;
        }
      }
    }

    if (type === 'water') {
      walls[wallKey(x, y)] = true;

      if (Math.random() < 0.01) {
        decorations[wallKey(x, y)] = {
          id: uuid(),
          position: {
            x,
            y,
          },
          place: 'water',
          block: false,
          size:
            Math.random() < 0.4
              ? '01'
              : Math.random() < 0.7
              ? '02'
              : Math.random() < 0.9
              ? '03'
              : '04',
        };
      }
    }
  }

  map.push(row);
}

export const createMapSlicer: StateCreator<GameState, [], [], MapState> = (
  set,
) => ({
  map,
  trees: trees.map((tree) => updateTree(walls, tree)),
  walls,
  decorations,

  chopTree: (id) =>
    set((state) => {
      const tree = state.trees.find((tree) => tree.id === id);

      let newWalls = {
        ...state.walls,
      };

      if (tree) {
        newWalls[wallKey(tree.position.x, tree.position.y)] = false;
      }

      return {
        walls: newWalls,
        trees: state.trees.map((tree) => {
          const newTree =
            tree.id === id
              ? {
                  ...tree,
                  health: 0,
                }
              : tree;

          return updateTree(newWalls, newTree);
        }),
      };
    }),
});
