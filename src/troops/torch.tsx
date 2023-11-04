// import { Troop } from './troop.tsx';

// const WIDTH = 1344;
// const HEIGHT = 960;

// const X_SPRITES = 7;
// const Y_SPRITES = 5;

// const FACTION = 'Goblins';

// const TROOP = 'Torch';
// const COLOR = 'Blue';

// const TOTAL_SPRITES_IDLE = 7;
// const TOTAL_SPRITES = 6;

export function Torch({
  x,
  y,
  animation,
}: {
  x: number;
  y: number;
  animation: TorchAnimation;
}) {
  // const posY = animation * (HEIGHT / Y_SPRITES);

  // const spriteCount =
  //   TorchAnimation.Idle === animation ? TOTAL_SPRITES_IDLE : TOTAL_SPRITES;

  return null;

  // return (
  //   <Troop
  //     imageWidth={WIDTH}
  //     imageHeight={HEIGHT}
  //     startX={x}
  //     startY={y}
  //     spriteCount={spriteCount}
  //     faction={FACTION}
  //     troopType={TROOP}
  //     color={COLOR}
  //     spriteYPosition={posY}
  //     xSprites={X_SPRITES}
  //     ySprites={Y_SPRITES}
  //   />
  // );
}

export enum TorchAnimation {
  Idle = 0,
  Walk = 1,
  AttackRight = 2,
  AttackDown = 3,
  AttackUp = 4,
}
