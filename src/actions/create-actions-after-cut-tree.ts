import { useGameStore } from '../store/index.tsx';
import { doAction } from '../troops/actions.tsx';
import { TroopEntity } from '../util/types.ts';
import { createChopAction } from './create-chop-action.ts';
import { createResourceAction } from './create-resource-action.ts';

/**
 * When the user ends the action of cutting a tree
 * we should decide what action to next
 * Can be:
 * - chop another tree
 * - load the resource if there at least 3 resources around
 */
export function createActionsAfterCutTree(troop: TroopEntity, treeId: string) {
  useGameStore.getState().chopTree(treeId);

  const trees = useGameStore.getState().trees;
  const tree = trees.find((tree) => tree.id === treeId);
  const resources = useGameStore.getState().resources;

  if (tree) {
    const availableResources = resources.filter(
      (resource) =>
        resource.willBeLoadedBy === troop.id && !resource.isBeingLoadedBy,
    );

    if (availableResources.length >= 3) {
      return doAction({
        ...troop,
        actionInProgress: false,
        actions: [
          ...createResourceAction(troop, tree.position),
          ...createChopAction(troop, tree.position),
        ],
      });
    }

    return doAction({
      ...troop,
      actionInProgress: false,
      actions: createChopAction(troop, tree.position),
    });
  }

  console.log('nothing?');

  return troop;
}
