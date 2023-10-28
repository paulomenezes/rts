import { TreeEntity } from '../util/types.ts';

export function updateTree(trees: TreeEntity[], tree: TreeEntity): TreeEntity {
  for (const side of [
    [-1, 0],
    [1, 0],
  ]) {
    const x = tree.position.x + side[0];
    const y = tree.position.y + side[1];

    const neighborTrees = trees.filter(
      (neighbor) =>
        neighbor.position.x === x &&
        neighbor.position.y === y &&
        neighbor.health > 0,
    );

    if (neighborTrees.length === 0) {
      return {
        ...tree,
        reachable: true,
        reachableDirection: side[0] === -1 ? 'left' : 'right',
      };
    }
  }

  return tree;
}
