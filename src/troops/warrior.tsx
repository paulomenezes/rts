import { Troop } from './troop.tsx';

const WIDTH = 1152;
const HEIGHT = 1536;

const X_SPRITES = 6;
const Y_SPRITES = 8;

const FACTION = 'Knights';

const TROOP = 'Warrior';
const COLOR = 'Blue';

const TOTAL_SPRITES = 6;

export function Warrior({
  x,
  y,
  animation,
}: {
  x: number;
  y: number;
  animation: WarriorAnimation;
}) {
  const posY = animation * (HEIGHT / Y_SPRITES);

  return (
    <Troop
      imageWidth={WIDTH}
      imageHeight={HEIGHT}
      startX={x}
      startY={y}
      spriteCount={TOTAL_SPRITES}
      faction={FACTION}
      troopType={TROOP}
      color={COLOR}
      spriteYPosition={posY}
      xSprites={X_SPRITES}
      ySprites={Y_SPRITES}
    />
  );
}

export enum WarriorAnimation {
  Idle = 0,
  Walk = 1,
  FrontAttack1 = 2,
  FrontAttack2 = 3,
  DownAttack1 = 4,
  DownAttack2 = 5,
  UpAttack1 = 6,
  UpAttack2 = 7,
}
