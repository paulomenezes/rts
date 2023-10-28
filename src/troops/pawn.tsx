import { TroopEntity } from '../util/types.ts';
import { Troop } from './troop.tsx';

const WIDTH = 1152;
const HEIGHT = 1152;

const X_SPRITES = 6;
const Y_SPRITES = 6;

const FACTION = 'Knights';

const TROOP = 'Pawn';
const COLOR = 'Blue';

const TOTAL_SPRITES = 6;

export function Pawn({
  frameTime,
  troop,
}: {
  frameTime: number;
  troop: TroopEntity;
}) {
  const posY = troop.animation * (HEIGHT / Y_SPRITES);

  return (
    <Troop
      imageWidth={WIDTH}
      imageHeight={HEIGHT}
      spriteCount={TOTAL_SPRITES}
      faction={FACTION}
      troopType={TROOP}
      color={COLOR}
      spriteYPosition={posY}
      xSprites={X_SPRITES}
      ySprites={Y_SPRITES}
      frameTime={frameTime}
      troop={troop}
    />
  );
}
