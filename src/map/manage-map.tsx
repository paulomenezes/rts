import { CSSProperties, Fragment, memo } from 'react';
import { useGameStore } from '../store/index.tsx';
import { TILE_SIZE, wallKey } from '../util/const.ts';
import { MAP_TYPE } from '../util/types.ts';
import { desert, water } from './utils.ts';

export const ManageMap = memo(function ManageMap() {
  const debug = useGameStore((state) => state.debug);
  const map = useGameStore((state) => state.map);
  const walls = useGameStore((state) => state.walls);
  const cameraPosition = useGameStore((state) => state.cameraPosition);
  const tilesOnScreen = useGameStore((state) => state.tilesOnScreen);

  return (
    <div className="absolute">
      {map.map((_, x) => (
        <Fragment key={x}>
          {map[x].map((_, y) => {
            if (
              !(
                x >= cameraPosition.x * -1 - 2 &&
                x <= cameraPosition.x * -1 + tilesOnScreen.x &&
                y >= cameraPosition.y * -1 - 2 &&
                y <= cameraPosition.y * -1 + tilesOnScreen.y
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
                      zIndex: type === 'water' ? 0 : type === 'desert' ? 2 : 3,
                    } as CSSProperties
                  }
                >
                  {/* {debug ? `${x} - ${y}` : null} */}
                </div>

                {debug && walls[wallKey(x, y)] && (
                  <div
                    className="absolute flex items-center justify-center bg-red-500/40 text-center"
                    style={
                      {
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        top: TILE_SIZE * y,
                        left: TILE_SIZE * x,
                        zIndex: 300,
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
          zIndex: 1,
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
        zIndex: type === 'water' ? 0 : type === 'desert' ? 2 : 3,
      }}
    />
  );
}
