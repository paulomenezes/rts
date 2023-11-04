import { useGameStore } from '../store/index.tsx';
import { findClosest } from '../util/functions.ts';
import { Position, TroopActionsEntity, TroopEntity } from '../util/types.ts';
import { createResourceAction } from './create-resource-action.ts';

export function createChopAction(
  troop: TroopEntity,
  position: Position,
): TroopActionsEntity[] {
  const trees = useGameStore.getState().trees;
  const availableResources = useGameStore
    .getState()
    .resources.filter(
      (resource) =>
        resource.willBeLoadedBy === troop.id && !resource.isBeingLoadedBy,
    );

  const closestTree = findClosest(
    trees,
    position,
    (tree) => tree.reachable && tree.health > 0,
  );

  // If the tree is too far, delivery the resources first
  if (availableResources.length > 0 && !closestTree) {
    return createResourceAction(troop, position);
  }

  if (closestTree) {
    // if (
    //   availableResources.length > 0 &&
    //   calculateDistance(closestTree.position, position) > 3
    // ) {
    //   return createResourceAction(troop, position);
    // }

    let delta = 0;

    if (closestTree?.reachableDirection === 'both') {
      delta = closestTree.position.x - troop.position.x < 0 ? 1 : -1;
    } else {
      delta = closestTree?.reachableDirection === 'left' ? -1 : 1;
    }

    return [
      {
        moveReason: 'chop',
        destinationAction: 'move',
        destination: {
          x: closestTree.position.x + delta,
          y: closestTree.position.y,
        },
      },
      {
        destinationAction: 'chop',
        chopTreeId: closestTree.id,
      },
    ];
  }

  return [];
}
