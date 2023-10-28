import { Troop } from './troop.tsx';

const WIDTH = 1344;
const HEIGHT = 576;

const X_SPRITES = 7;
const Y_SPRITES = 3;

const FACTION = 'Goblins';

const TROOP = 'TNT';
const COLOR = 'Blue';

const TOTAL_SPRITES_IDLE_WALK = 6;
const TOTAL_SPRITES = 7;

export function TNT({
  x,
  y,
  animation,
}: {
  x: number;
  y: number;
  animation: TNTAnimation;
}) {
  const posY = animation * (HEIGHT / Y_SPRITES);

  const spriteCount = [TNTAnimation.Idle, TNTAnimation.Walk].includes(animation)
    ? TOTAL_SPRITES_IDLE_WALK
    : TOTAL_SPRITES;

  return (
    <Troop
      imageWidth={WIDTH}
      imageHeight={HEIGHT}
      startX={x}
      startY={y}
      spriteCount={spriteCount}
      faction={FACTION}
      troopType={TROOP}
      color={COLOR}
      spriteYPosition={posY}
      xSprites={X_SPRITES}
      ySprites={Y_SPRITES}
    />
  );
}

export enum TNTAnimation {
  Idle = 0,
  Walk = 1,
  Throw = 2,
}
