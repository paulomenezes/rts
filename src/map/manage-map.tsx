import { CSSProperties, Fragment, memo } from 'react';
import { useGameStore } from '../store/index.tsx';
import {
  CAMERA_MAP_OFFSET,
  TILE_SIZE,
  wallKey,
  Z_INDEX,
} from '../util/const.ts';
import { DECORATION_SIZES, MAP_TYPE } from '../util/types.ts';
import { desert, water } from './utils.ts';

const DECORATIONS_LARGE: Record<number, { width: number; height: number }> = {
  16: {
    width: 64,
    height: 128,
  },
  17: {
    width: 64,
    height: 128,
  },
  18: {
    width: 192,
    height: 192,
  },
};

export const ManageMap = memo(function ManageMap() {
  const debug = useGameStore((state) => state.debug);
  const map = useGameStore((state) => state.map);
  const walls = useGameStore((state) => state.walls);
  const decorations = useGameStore((state) => state.decorations);
  const cameraPosition = useGameStore((state) => state.cameraPosition);
  const tilesOnScreen = useGameStore((state) => state.tilesOnScreen);

  return (
    <div className="absolute">
      {map.map((_, x) => (
        <Fragment key={x}>
          {map[x].map((_, y) => {
            if (
              !(
                x >= cameraPosition.x * -1 - CAMERA_MAP_OFFSET &&
                x <=
                  cameraPosition.x * -1 + tilesOnScreen.x + CAMERA_MAP_OFFSET &&
                y >= cameraPosition.y * -1 - CAMERA_MAP_OFFSET &&
                y <= cameraPosition.y * -1 + tilesOnScreen.y + CAMERA_MAP_OFFSET
              )
            ) {
              return null;
            }

            const type = map[x][y];

            let tileX = 0;
            let tileY = 0;

            let hasFoam = true;
            let hasDesert = true;

            if (type === 'desert') {
              tileX = 6;
              tileY = 1;

              hasDesert = false;

              if (water(x, y, true, false, false, true)) {
                tileX = 5;
                tileY = 0;
              } else if (water(x, y, true, false, false, false)) {
                tileX = 6;
                tileY = 0;
              } else if (water(x, y, true, true, false, false)) {
                tileX = 7;
                tileY = 0;
              } else if (water(x, y, false, true, false, false)) {
                tileX = 7;
                tileY = 1;
              } else if (water(x, y, false, true, true, false)) {
                tileX = 7;
                tileY = 2;
              } else if (water(x, y, false, false, true, false)) {
                tileX = 6;
                tileY = 2;
              } else if (water(x, y, false, false, true, true)) {
                tileX = 5;
                tileY = 2;
              } else if (water(x, y, false, false, false, true)) {
                tileX = 5;
                tileY = 1;
              } else if (water(x, y, true, true, false, true)) {
                tileX = 8;
                tileY = 0;
              } else if (water(x, y, false, true, false, true)) {
                tileX = 8;
                tileY = 1;
              } else if (water(x, y, false, true, true, true)) {
                tileX = 8;
                tileY = 2;
              } else if (water(x, y, true, true, true, true)) {
                tileX = 8;
                tileY = 3;
              } else if (water(x, y, true, true, true, false)) {
                tileX = 7;
                tileY = 3;
              } else if (water(x, y, true, false, true, false)) {
                tileX = 6;
                tileY = 3;
              } else if (water(x, y, true, false, true, true)) {
                tileX = 5;
                tileY = 3;
              } else {
                hasFoam = false;
              }
            } else if (type === 'ground') {
              tileX = 1;
              tileY = 1;

              hasDesert = true;
              hasFoam = false;

              if (desert(x, y, true, false, false, true)) {
                tileX = 0;
                tileY = 0;
              } else if (desert(x, y, true, false, false, false)) {
                tileX = 1;
                tileY = 0;
              } else if (desert(x, y, true, true, false, false)) {
                tileX = 2;
                tileY = 0;
              } else if (desert(x, y, false, true, false, false)) {
                tileX = 2;
                tileY = 1;
              } else if (desert(x, y, false, true, true, false)) {
                tileX = 2;
                tileY = 2;
              } else if (desert(x, y, false, false, true, false)) {
                tileX = 1;
                tileY = 2;
              } else if (desert(x, y, false, false, true, true)) {
                tileX = 0;
                tileY = 2;
              } else if (desert(x, y, false, false, false, true)) {
                tileX = 0;
                tileY = 1;
              } else if (desert(x, y, true, true, false, true)) {
                tileX = 3;
                tileY = 0;
              } else if (desert(x, y, false, true, false, true)) {
                tileX = 3;
                tileY = 1;
              } else if (desert(x, y, false, true, true, true)) {
                tileX = 3;
                tileY = 2;
              } else if (desert(x, y, true, true, true, true)) {
                tileX = 3;
                tileY = 3;
              } else if (desert(x, y, true, true, true, false)) {
                tileX = 2;
                tileY = 3;
              } else if (desert(x, y, true, false, true, false)) {
                tileX = 1;
                tileY = 3;
              } else if (desert(x, y, true, false, true, true)) {
                tileX = 0;
                tileY = 3;
              } else {
                hasDesert = false;
              }
            } else if (type === 'water') {
              hasFoam = false;
              hasDesert = false;
            }

            const decoration = decorations[wallKey(x, y)];

            return (
              <Fragment key={y}>
                {hasFoam && <Foam x={x} y={y} />}
                {hasDesert && <Desert type={type} x={x} y={y} />}

                <div
                  className="absolute flex items-center justify-center border-red-500 text-center"
                  style={
                    {
                      '--background-position-x': `${-(tileX * TILE_SIZE)}px`,
                      '--background-position-y': `${-(tileY * TILE_SIZE)}px`,
                      '--top': `${TILE_SIZE * y}px`,
                      '--left': `${TILE_SIZE * x}px`,
                      backgroundImage:
                        type === 'water'
                          ? `url("/assets/Terrain/Water/Water.png")`
                          : `url("/assets/Terrain/Ground/Tilemap_Flat.png")`,
                      backgroundPosition: `-${tileX * TILE_SIZE}px -${
                        tileY * TILE_SIZE
                      }px`,
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                      top: TILE_SIZE * y,
                      left: TILE_SIZE * x,
                      zIndex:
                        type === 'water'
                          ? Z_INDEX.WATER
                          : type === 'desert'
                          ? Z_INDEX.DESERT
                          : Z_INDEX.GROUND,
                    } as CSSProperties
                  }
                >
                  {/* {debug ? `${x} - ${y}` : null} */}
                </div>

                {decoration?.place === 'water' ? (
                  <Rock x={x} y={y} size={decoration.size} />
                ) : (
                  decoration?.place === 'ground' && (
                    <Decoration x={x} y={y} type={decoration.type} />
                  )
                )}

                {debug && walls[wallKey(x, y)] && (
                  <div
                    className="absolute flex items-center justify-center bg-red-500/40 text-center"
                    style={
                      {
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        top: TILE_SIZE * y,
                        left: TILE_SIZE * x,
                        zIndex: y + Z_INDEX.MAP_DEBUG,
                      } as CSSProperties
                    }
                  />
                )}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
});

function Rock({
  x,
  y,
  size,
}: {
  x: number;
  y: number;
  size: DECORATION_SIZES;
}) {
  return (
    <div
      className="play absolute flex items-center justify-center text-center"
      style={
        {
          '--pos-x': `-${128 * 8}px`,
          '--pos-y': `0px`,
          backgroundImage: `url("/assets/Terrain/Water/Rocks/Rocks_${size}.png")`,
          animation: `play 1s steps(8) infinite`,
          width: 128,
          height: 128,
          top: TILE_SIZE * y - TILE_SIZE / 2,
          left: TILE_SIZE * x - TILE_SIZE / 2,
          zIndex: Z_INDEX.WATER_ROCK,
        } as CSSProperties
      }
    />
  );
}

function Decoration({ x, y, type }: { x: number; y: number; type: number }) {
  const offsetX =
    Math.floor((DECORATIONS_LARGE[type]?.width ?? TILE_SIZE) / TILE_SIZE / 2) *
    TILE_SIZE;

  const offsetY =
    (Math.floor((DECORATIONS_LARGE[type]?.height ?? TILE_SIZE) / TILE_SIZE) -
      1) *
    TILE_SIZE;

  return (
    <div
      className="absolute flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: `url("/assets/Deco/${type
          .toString()
          .padStart(2, '0')}.png")`,
        width: DECORATIONS_LARGE[type]?.width ?? TILE_SIZE,
        height: DECORATIONS_LARGE[type]?.height ?? TILE_SIZE,
        top: TILE_SIZE * y - offsetY,
        left: TILE_SIZE * x - offsetX,
        zIndex: y * 100,
      }}
    />
  );
}

function Foam({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="play absolute flex items-center justify-center text-center"
      style={
        {
          '--pos-x': `-${192 * 8}px`,
          '--pos-y': `0px`,
          backgroundImage: `url("/assets/Terrain/Water/Foam/Foam.png")`,
          animation: `play 1s steps(8) infinite`,
          width: 192,
          height: 192,
          top: TILE_SIZE * y - TILE_SIZE,
          left: TILE_SIZE * x - TILE_SIZE,
          zIndex: Z_INDEX.WATER_FOAM,
        } as CSSProperties
      }
    />
  );
}

function Desert({ type, x, y }: { type: MAP_TYPE; x: number; y: number }) {
  return (
    <div
      className="absolute flex items-center justify-center text-center"
      style={{
        backgroundImage: `url("/assets/Terrain/Ground/Tilemap_Flat.png")`,
        backgroundPosition: `-${6 * TILE_SIZE}px -${1 * TILE_SIZE}px`,
        width: TILE_SIZE,
        height: TILE_SIZE,
        top: TILE_SIZE * y,
        left: TILE_SIZE * x,
        zIndex: Z_INDEX.DESERT, // y, // type === 'water' ? 0 : type === 'desert' ? 2 : 3,
      }}
    />
  );
}
