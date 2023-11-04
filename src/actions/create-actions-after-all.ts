import { useGameStore } from '../store/index.tsx';
import { findClosest } from '../util/functions.ts';
import { TroopEntity } from '../util/types.ts';
import { createChopAction } from './create-chop-action.ts';
import { createResourceAction } from './create-resource-action.ts';

export function createActionsAfterAll(troop: TroopEntity): TroopEntity {
  const trees = useGameStore.getState().trees;
  const resources = useGameStore.getState().resources;

  const destinationTree = findClosest(
    trees,
    troop.position,
    (tree) => tree.reachable && tree.health > 0,
  );

  if (destinationTree) {
    return {
      ...troop,
      actionInProgress: false,
      actions: createChopAction(troop, destinationTree.position),
    };
  }

  const resource = findClosest(
    resources,
    troop.position,
    (resource) =>
      !resource.isBeingLoadedBy && resource.willBeLoadedBy === troop.id,
  );

  if (resource) {
    return {
      ...troop,
      actionInProgress: false,
      actions: createResourceAction(troop, resource.position),
    };
  }

  return troop;
}
