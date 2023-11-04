import { createActionsAfterAll } from '../actions/create-actions-after-all.ts';
import { createChopAction } from '../actions/create-chop-action.ts';
import { createDeliveryAction } from '../actions/create-delivery-action.ts';
import { createResourceAction } from '../actions/create-resource-action.ts';
import { useGameStore } from '../store/index.tsx';
import { generatePath } from '../util/generate-path.ts';
import { PawnAnimation, TroopEntity } from '../util/types.ts';

export function doAction(troop: TroopEntity): TroopEntity {
  const map = useGameStore.getState().map;
  const walls = useGameStore.getState().walls;
  const trees = useGameStore.getState().trees;
  const resources = useGameStore.getState().resources;

  if (troop.actions.length > 0) {
    const action = troop.actions.shift()!;

    // If the current action is move
    if (action.destinationAction === 'move') {
      // Check if the troop is not already moving
      if (!troop.actionInProgress) {
        const nextAction = troop.actions.at(0);

        if (
          action.moveReason === 'chop' &&
          nextAction?.destinationAction === 'chop'
        ) {
          const tree = trees.find(
            (tree) => tree.id === nextAction.chopTreeId && tree.health > 0,
          );

          if (!tree) {
            return doAction({
              ...troop,
              actionInProgress: false,
              actions: createChopAction(troop, troop.position),
            });
          }
        } else if (
          action.moveReason === 'resource' &&
          nextAction?.destinationAction === 'resource'
        ) {
          const resource = resources.find(
            (resource) =>
              resource.id === nextAction.resourceId &&
              !resource.isBeingLoadedBy,
          );

          if (!resource) {
            return doAction({
              ...troop,
              actionInProgress: false,
              actions: createResourceAction(troop, troop.position),
            });
          }
        }

        // If not, set the actionInProgress to true, set the path, and set the animation to walk
        const path = generatePath(
          map,
          walls,
          [Math.floor(troop.position.x), Math.floor(troop.position.y)],
          [Math.floor(action.destination.x), Math.floor(action.destination.y)],
        );

        action.path = path;
        action.pathIndex = 0;

        return {
          ...troop,
          actionInProgress: true,
          actions: [action, ...troop.actions],
          animation:
            troop.carryAmount > 0 ? PawnAnimation.CarryRun : PawnAnimation.Walk,
        };
      } else {
        // If the troop is already moving, check if the troop is at the destination
        if (
          troop.position.x === action.destination.x &&
          troop.position.y === action.destination.y
        ) {
          // If the troop is at the destination, set the actionInProgress to false, set the animation to idle, and return the troop
          troop.actionInProgress = false;
          troop.animation =
            troop.carryAmount > 0
              ? PawnAnimation.CarryIdle
              : PawnAnimation.Idle;

          if (action.moveReason === 'delivery') {
            troop.carry = undefined;
            troop.carryAmount = 0;
          }

          // When the troop is at the destination, check if there are more actions
          return doAction(troop);
        }
      }
    } else if (action.destinationAction === 'chop') {
      let destinationTree = trees.find(
        (tree) => tree.id === action.chopTreeId && tree.health > 0,
      );

      useGameStore.getState().addTroopToChopTree(troop.id, action.chopTreeId);

      // If the tree does not exist anymore, reset the actions to chop another tree
      if (!destinationTree) {
        return doAction({
          ...troop,
          actionInProgress: false,
          actions: createChopAction(troop, troop.position),
        });
      }

      const newTroop = {
        ...troop,
        actionInProgress: true,
        actions: [action, ...troop.actions],
        animation: PawnAnimation.Chop,
      };

      return newTroop;
    } else if (action.destinationAction === 'resource') {
      const resource = useGameStore
        .getState()
        .resources.find(
          (resource) =>
            resource.id === action.resourceId && !resource.isBeingLoadedBy,
        );

      // If resource exist
      if (resource) {
        // Update the current resource to be loaded by the troop
        useGameStore.getState().updateResource(action.resourceId, {
          willBeLoadedBy: troop.id,
          isBeingLoadedBy: troop.id,
        });

        const isLastActionAMove =
          troop.actions.at(-1)?.destinationAction === 'move';

        const resourceActions = troop.actions.filter(
          (action) => action.destinationAction === 'resource',
        );

        return doAction({
          ...troop,
          carry: action.carry,
          carryAmount: troop.carryAmount + 1,
          actionInProgress: false,
          actions:
            // If the last action is a move
            // (i.e there is no tree to chop after),
            // and there is only one resource action
            // (i.e we don't want to add more resources while there is multiple resources in the queue),
            // add a resource action
            isLastActionAMove && resourceActions.length === 1
              ? [
                  ...troop.actions,
                  ...createResourceAction(troop, troop.position),
                ]
              : troop.actions,
          animation: PawnAnimation.CarryRun,
        });
      }

      if (troop.carryAmount > 0) {
        return doAction({
          ...troop,
          actionInProgress: false,
          actions: createDeliveryAction(),
        });
      }

      return doAction({
        ...troop,
        actionInProgress: false,
        actions: createResourceAction(troop, troop.position),
      });
    }

    return {
      ...troop,
      actions: [action, ...troop.actions],
    };
  }

  // const newTroop = createActionsAfterAll(troop);

  // if (newTroop.actions.length > 0) {
  //   return doAction(newTroop);
  // }

  // If there are no more actions, set the actionInProgress to false, and set the animation to idle
  return {
    ...troop,
    actions: [],
    actionInProgress: false,
    animation:
      troop.carryAmount > 0 ? PawnAnimation.CarryIdle : PawnAnimation.Idle,
  };
}
