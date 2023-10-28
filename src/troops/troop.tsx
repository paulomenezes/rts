import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../store/index.tsx';
import { TILE_SIZE } from '../util/const.ts';
import { TroopEntity } from '../util/types.ts';

export function Troop({
  imageWidth,
  imageHeight,
  spriteCount,
  faction,
  troopType,
  color,
  spriteYPosition,
  xSprites,
  ySprites,
  frameTime,
  troop,
}: {
  imageWidth: number;
  imageHeight: number;
  spriteCount: number;
  faction: string;
  troopType: string;
  color: string;
  spriteYPosition: number;
  xSprites: number;
  ySprites: number;
  frameTime: number;
  troop: TroopEntity;
}) {
  const width = useMemo(() => imageWidth / xSprites, [imageWidth, xSprites]);
  const height = useMemo(() => imageHeight / ySprites, [imageHeight, ySprites]);

  const debug = useGameStore((state) => state.debug);
  const trees = useGameStore((state) => state.trees);
  const setTroopPosition = useGameStore((state) => state.setTroopPosition);

  const startX = useMemo(
    () => troop.position.x - TILE_SIZE,
    [troop.position.x],
  );
  const startY = useMemo(
    () => troop.position.y - TILE_SIZE,
    [troop.position.y],
  );

  const destination = useMemo(
    () => troop.path?.at(troop.pathIndex ?? 0),
    [troop.path, troop.pathIndex],
  );

  const [posX, setPosX] = useState(startX);
  const [posY, setPosY] = useState(startY);

  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (destination) {
      const destX = Math.max(-TILE_SIZE, destination.x - width / 2);
      const destY = Math.max(-TILE_SIZE, destination.y - height / 2);

      if (destX < posX) {
        setPosX((prev) => Math.max(destX, prev - 3));
      } else if (destX > posX) {
        setPosX((prev) => Math.min(destX, prev + 3));
      }

      if (destY < posY) {
        setPosY((prev) => Math.max(destY, prev - 3));
      } else if (destY > posY) {
        setPosY((prev) => Math.min(destY, prev + 3));
      }

      if (Math.abs(destX - posX) < 2 && Math.abs(destY - posY) < 2) {
        setTroopPosition(troop.id, {
          x: destX + TILE_SIZE,
          y: destY + TILE_SIZE,
        });
      } else {
        setFlip(destX < posX);
      }
    } else if (troop.destinationAction === 'chop') {
      const tree = trees.find((tree) => tree.id === troop.chopTreeId);

      if (tree && tree.position.x - troop.position.x / TILE_SIZE === -1) {
        setFlip(true);
      }
    }
  }, [frameTime]);

  return (
    <>
      {troop.path && debug && (
        <>
          {troop.path.map((p, i) => (
            <div
              key={i}
              className="absolute z-50 h-16 w-16 bg-blue-500/40"
              style={{
                left: p.x - TILE_SIZE / 2,
                top: p.y - TILE_SIZE / 2,
              }}
            />
          ))}
        </>
      )}
      {debug && (
        <div
          className="absolute z-50 border-2 border-blue-500"
          style={{
            top: startY,
            left: startX,
            width,
            height,
          }}
        ></div>
      )}
      <div
        className="absolute z-50"
        style={{
          top: posY,
          left: posX,
          width,
          height,
        }}
      >
        {troop.selected && (
          <>
            <div
              className="absolute left-8 top-8 h-16 w-16 animate-tl-bounce"
              style={{
                backgroundImage: `url("/assets/UI/Pointers/03.png")`,
              }}
            />
            <div
              className="absolute right-8 top-8 h-16 w-16 animate-tr-bounce"
              style={{
                backgroundImage: `url("/assets/UI/Pointers/04.png")`,
              }}
            />
            <div
              className="absolute bottom-8 left-8 h-16 w-16 animate-bl-bounce"
              style={{
                backgroundImage: `url("/assets/UI/Pointers/05.png")`,
              }}
            />
            <div
              className="absolute bottom-8 right-8 h-16 w-16 animate-br-bounce"
              style={{
                backgroundImage: `url("/assets/UI/Pointers/06.png")`,
              }}
            />
          </>
        )}

        <div
          className="absolute animate-play"
          style={
            {
              '--pos-x': `-${width * spriteCount}px`,
              '--pos-y': `-${spriteYPosition}px`,
              backgroundImage: `url("/assets/Factions/${faction}/Troops/${troopType}/${color}/${troopType}_${color}.png")`,
              backgroundPosition: `0px -${spriteYPosition}px`,
              transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
              width,
              height,
              animation: `play 0.5s steps(${spriteCount}) infinite`,
            } as CSSProperties
          }
        />
      </div>
    </>
  );
}
