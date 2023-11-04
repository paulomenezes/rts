import { useGameStore } from '../store/index.tsx';
import { findNClosest } from '../util/functions.ts';
import { Position, TroopActionsEntity, TroopEntity } from '../util/types.ts';
import { createChopAction } from './create-chop-action.ts';
import { createDeliveryAction } from './create-delivery-action.ts';

export function createResourceAction(
  troop: TroopEntity,
  position: Position,
): TroopActionsEntity[] {
  const nextResources = findNClosest(
    useGameStore.getState().resources,
    position,
    3,
    (resource) =>
      !resource.isBeingLoadedBy && resource.willBeLoadedBy === troop.id,
  );

  if (nextResources.length > 0) {
    const actions: TroopActionsEntity[] = [];

    for (let index = 0; index < nextResources.length; index++) {
      const resource = nextResources[index];

      useGameStore.getState().updateResource(resource.id, {
        willBeLoadedBy: troop.id,
      });

      actions.push(
        {
          moveReason: 'resource',
          destinationAction: 'move',
          destination: resource.position,
        },
        {
          destinationAction: 'resource',
          resourceId: resource.id,
          carry: 'wood',
        },
      );
    }

    actions.push(...createDeliveryAction());
    // actions.push(...createChopAction(troop, position));

    return actions;
  }

  return createChopAction(troop, position);
}
