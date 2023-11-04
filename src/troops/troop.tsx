import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../store/index.tsx';
import { TILE_SIZE, Z_INDEX } from '../util/const.ts';
import { TroopActionsMoveEntity, TroopEntity } from '../util/types.ts';

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

  const [pathIndex, setPathIndex] = useState(0);

  const [startX, startY] = useMemo(
    () => [troop.position.x, troop.position.y],
    [troop.position],
  );

  const action = useMemo(() => troop.actions.at(0), [troop.actions.at(0)]);

  const destination = useMemo(
    () =>
      action?.destinationAction === 'move'
        ? action.path?.at(pathIndex)
        : undefined,
    [action, pathIndex],
  );

  const [posX, setPosX] = useState(startX);
  const [posY, setPosY] = useState(startY);

  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (destination) {
      const destX = Math.max(-1, destination.x); // - width / 2);
      const destY = Math.max(-1, destination.y); // - height / 2);

      if (destX < posX) {
        setPosX((prev) => Math.max(destX, prev - frameTime / 150));
      } else if (destX > posX) {
        setPosX((prev) => Math.min(destX, prev + frameTime / 150));
      }

      if (destY < posY) {
        setPosY((prev) => Math.max(destY, prev - frameTime / 150));
      } else if (destY > posY) {
        setPosY((prev) => Math.min(destY, prev + frameTime / 150));
      }

      if (Math.abs(destX - posX) < 0.1 && Math.abs(destY - posY) < 0.1) {
        setTroopPosition(troop.id, {
          x: destX,
          y: destY,
        });

        setPathIndex((prev) => {
          if (prev + 1 === (action as TroopActionsMoveEntity)!.path!.length) {
            return 0;
          }

          return prev + 1;
        });

        setPosX(destX);
        setPosY(destY);
      } else {
        setFlip(destX < posX);
      }
    } else if (action?.destinationAction === 'chop') {
      const tree = trees.find((tree) => tree.id === action.chopTreeId);

      if (tree && tree.position.x - troop.position.x === -1) {
        setFlip(true);
      }
    }
  }, [frameTime]);

  return (
    <>
      {action?.destinationAction === 'move' && action.path && debug && (
        <>
          {action.path.map((p, i) => (
            <div
              key={i}
              className="absolute z-50 h-16 w-16 bg-blue-500/40"
              style={{
                left: p.x * TILE_SIZE,
                top: p.y * TILE_SIZE,
              }}
            />
          ))}
        </>
      )}
      {debug && (
        <div
          className="absolute z-50 border-2 border-blue-500"
          style={{
            top: startY * TILE_SIZE - TILE_SIZE,
            left: startX * TILE_SIZE - TILE_SIZE,
            width,
            height,
          }}
        >
          <span className="absolute left-16 top-[50px] bg-black text-xs text-white">
            {/* {posX.toFixed(2)} - {posY.toFixed(2)} */}
            {troop.id} - {troop.carryAmount}
          </span>
        </div>
      )}
      <div
        className="absolute"
        style={{
          zIndex: posY * Z_INDEX.ITEM_OFFSET + Z_INDEX.TROOP,
          top: posY * TILE_SIZE - TILE_SIZE,
          left: posX * TILE_SIZE - TILE_SIZE,
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

      {troop.carryAmount > 0 && (
        <div
          className="absolute overflow-hidden"
          style={{
            top: posY * TILE_SIZE - TILE_SIZE,
            left: posX * TILE_SIZE - TILE_SIZE,
            zIndex: posY * Z_INDEX.ITEM_OFFSET + Z_INDEX.TROOP,
            width: '128px',
            height: '128px',
          }}
        >
          {troop.carryAmount > 1 && <ResourceAsset x={36} y={-15} />}
          {troop.carryAmount > 2 && <ResourceAsset x={30} y={-29} />}
          {troop.carryAmount > 0 && <ResourceAsset x={22} y={-15} />}
        </div>
      )}
    </>
  );
}

function ResourceAsset({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute overflow-hidden"
      style={
        {
          width: '128px',
          height: '128px',
          top: y,
          left: x,
          transform: 'scaleX(-1)',
        } as CSSProperties
      }
    >
      <img src="/assets/Resources/Resources/W_Idle.png" />
    </div>
  );
}
