import { Position, TroopActionsEntity } from '../util/types.ts';

export function createMoveAction(position: Position): TroopActionsEntity[] {
  return [
    {
      destinationAction: 'move',
      destination: position,
    },
  ];
}
