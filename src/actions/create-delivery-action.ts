import { TroopActionsEntity } from '../util/types.ts';

export function createDeliveryAction(): TroopActionsEntity[] {
  return [
    {
      moveReason: 'delivery',
      destinationAction: 'move',
      destination: {
        x: 7,
        y: 8,
      },
    },
  ];
}
