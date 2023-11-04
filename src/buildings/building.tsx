import { CSSProperties, useMemo } from 'react';
import { useHasTroopBehind } from '../hooks/use-has-troop-behind.tsx';
import { useGameStore } from '../store/index.tsx';
import { TILE_SIZE, Z_INDEX } from '../util/const.ts';
import { cn } from '../util/functions.ts';
import { BuildingEntity } from '../util/types.ts';

export function Building({ building }: { building: BuildingEntity }) {
  const debug = useGameStore((state) => state.debug);

  const x = useMemo(
    () => building.position.x * TILE_SIZE - TILE_SIZE * 2,
    [building.position.x],
  );
  const y = useMemo(
    () => building.position.y * TILE_SIZE - TILE_SIZE * 3,
    [building.position.y],
  );

  const hasTroopsBehind = useHasTroopBehind(building.position, {
    leftOffset: 2,
    rightOffset: 2,
    topOffset: 2,
  });

  return (
    <>
      <div
        className={cn('absolute overflow-hidden')}
        style={
          {
            top: y,
            left: x,
            width: 320,
            height: 256,
            zIndex:
              building.position.y * Z_INDEX.ITEM_OFFSET + Z_INDEX.RESOURCE,
            WebkitMaskImage: hasTroopsBehind
              ? 'linear-gradient(rgba(0, 0, 0, 0.3), black 100%)'
              : '',
          } as CSSProperties
        }
      >
        <img src="/assets/Factions/Knights/Buildings/Castle/Castle_Blue.png" />
      </div>

      {debug && (
        <div
          className={`absolute border-2 border-x-lime-500 text-xs text-white`}
          style={{
            zIndex: Z_INDEX.TREE_DEBUG,
            top: building.position.y * TILE_SIZE,
            left: building.position.x * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
        >
          {building.position.x} - {building.position.y}
        </div>
      )}
    </>
  );
}
