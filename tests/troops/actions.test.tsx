import { useGameStore } from '../../src/store/index.tsx';
import { createActionsFromUserInput } from '../../src/troops/actions.tsx';
import { PawnAnimation, TroopEntity } from '../../src/util/types.ts';

describe('Troop actions', () => {
  beforeEach(() => {
    useGameStore.setState({
      trees: [],
    });
  });

  test('actions', () => {
    const troop: TroopEntity = {
      id: '1',
      actions: [],
      actionInProgress: false,
      animation: PawnAnimation.Idle,
      position: { x: 1, y: 1 },
      selected: false,
    };

    const newTroop = createActionsFromUserInput(troop, { x: 3, y: 3 });

    expect(newTroop.actions).toHaveLength(1);

    const action = newTroop.actions.at(0);

    if (action?.destinationAction === 'move') {
      expect(action.destinationAction).toBe('move');
      expect(action.destination).toEqual({ x: 3, y: 3 });
    }
  });
});
