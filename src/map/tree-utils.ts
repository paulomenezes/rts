import { wallKey } from '../util/const.ts';
import { TreeEntity } from '../util/types.ts';

export function updateTree(
  newWalls: Record<string, boolean>,
  tree: TreeEntity,
): TreeEntity {
  const directions: Array<'left' | 'right'> = [];

  for (const side of [
    [-1, 0],
    [1, 0],
  ]) {
    const x = tree.position.x + side[0];
    const y = tree.position.y + side[1];

    if (!newWalls[wallKey(x, y)]) {
      directions.push(side[0] === -1 ? 'left' : 'right');
    }
  }

  if (directions.length > 0) {
    return {
      ...tree,
      reachable: true,
      reachableDirection: directions.length === 1 ? directions[0] : 'both',
    };
  }

  return tree;
}
