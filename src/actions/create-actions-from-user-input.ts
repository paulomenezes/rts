import { useGameStore } from '../store/index.tsx';
import { doAction } from '../troops/actions.tsx';
import { calculateMoveOffset } from '../util/calculate-move-offset.ts';
import { Position, TroopEntity } from '../util/types.ts';
import { createChopAction } from './create-chop-action.ts';
import { createMoveAction } from './create-move-action.ts';
import { createResourceAction } from './create-resource-action.ts';

export function createActionsFromUserInput(
  troop: TroopEntity,
  destination: Position,
): TroopEntity {
  const trees = useGameStore.getState().trees;
  const resources = useGameStore.getState().resources;

  const destinationTree = trees.find(
    (tree) =>
      tree.position.x === destination.x &&
      tree.position.y === destination.y &&
      tree.health > 0,
  );

  if (destinationTree) {
    return doAction({
      ...troop,
      actionInProgress: false,
      actions: createChopAction(troop, destination),
    });
  }

  const resource = resources.find(
    (resource) =>
      resource.position.x === destination.x &&
      resource.position.y === destination.y &&
      !resource.isBeingLoadedBy,
  );

  if (resource) {
    return doAction({
      ...troop,
      actionInProgress: false,
      actions: createResourceAction(troop, destination),
    });
  }

  const offset = calculateMoveOffset(troop, destination);

  return doAction({
    ...troop,
    actionInProgress: false,
    actions: createMoveAction({
      x: destination.x + offset.x,
      y: destination.y + offset.y,
    }),
  });
}
