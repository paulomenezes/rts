import { Troop } from './troop.tsx';

const WIDTH = 768;
const HEIGHT = 768;

const X_SPRITES = 6;
const Y_SPRITES = 6;

const FACTION = 'Goblins';

const TROOP = 'Barrel';
const COLOR = 'Blue';

const TOTAL_SPRITES_IDLE = 1;
const TOTAL_SPRITES_RUN_FIRED = 3;
const TOTAL_SPRITES = 6;

export function Barrel({
  x,
  y,
  animation,
}: {
  x: number;
  y: number;
  animation: BarrelAnimation;
}) {
  const posY = animation * (HEIGHT / Y_SPRITES);

  const spriteCount = [
    BarrelAnimation.IdleIn,
    BarrelAnimation.IdleOut,
  ].includes(animation)
    ? TOTAL_SPRITES_IDLE
    : [BarrelAnimation.Run, BarrelAnimation.Fired].includes(animation)
    ? TOTAL_SPRITES_RUN_FIRED
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

export enum BarrelAnimation {
  IdleIn = 0,
  Out = 1,
  IdleOut = 2,
  In = 3,
  Run = 4,
  Fired = 5,
}
