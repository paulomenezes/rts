// import { Troop } from './troop.tsx';

// const WIDTH = 1536;
// const HEIGHT = 1344;

// const X_SPRITES = 8;
// const Y_SPRITES = 7;

// const FACTION = 'Knights';

// const TROOP = 'Archer';
// const COLOR = 'Blue';

// const TOTAL_SPRITES_IDLE_WALK = 6;
// const TOTAL_SPRITES = 8;

export function Archer({
  x,
  y,
  animation,
}: {
  x: number;
  y: number;
  animation: ArcherAnimation;
}) {
  // const posY = animation * (HEIGHT / Y_SPRITES);

  // const spriteCount = [ArcherAnimation.Idle, ArcherAnimation.Walk].includes(
  //   animation,
  // )
  //   ? TOTAL_SPRITES_IDLE_WALK
  //   : TOTAL_SPRITES;

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

export enum ArcherAnimation {
  Idle = 0,
  Walk = 1,
  ShootUp = 2,
  ShootDiagonalUp = 3,
  ShootFront = 4,
  ShootDiagonalDown = 5,
  ShootDown = 6,
}
