import { StateCreator } from 'zustand';
import { updateTree } from '../map/tree-utils.ts';
import { MAP_SIZE } from '../util/const.ts';
import { uuid } from '../util/functions.ts';
import { perlinNoise } from '../util/noise.ts';
import { MAP_TYPE, TreeEntity } from '../util/types.ts';
import { GameState, MapState } from './types.tsx';

const mapSeed = perlinNoise.seed(1);
const treeSeed = perlinNoise.seed(2);

const map: MAP_TYPE[][] = [];
const trees: TreeEntity[] = [];

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
    }
  }

  map.push(row);
}

export const createMapSlicer: StateCreator<GameState, [], [], MapState> = (
  set,
) => ({
  map,
  trees: trees.map((tree) => updateTree(trees, tree)),
  treesBeingCut: {},

  hitTree: (id, amount) =>
    set((state) => {
      return {
        trees: state.trees.map((tree) => {
          const newTree =
            tree.id === id
              ? {
                  ...tree,
                  health: Math.max(0, tree.health - amount),
                }
              : tree;

          return updateTree(state.trees, newTree);
        }),
      };
    }),
});
