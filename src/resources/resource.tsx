import { CSSProperties, useMemo } from 'react';
import { useGameStore } from '../store/index.tsx';
import { TILE_SIZE, Z_INDEX } from '../util/const.ts';
import { ResourceEntity } from '../util/types.ts';
import './resource.css';
import { cn } from '../util/functions.ts';

export function Resource({ resource }: { resource: ResourceEntity }) {
  const debug = useGameStore((state) => state.debug);

  const x = useMemo(
    () => resource.position.x * TILE_SIZE,
    [resource.position.x],
  );
  const y = useMemo(
    () => resource.position.y * TILE_SIZE,
    [resource.position.y],
  );

  if (resource.isBeingLoadedBy) {
    return null;
  }

  return (
    <>
      <div
        className={cn('resourceIdle absolute overflow-hidden')}
        style={
          {
            top: y - TILE_SIZE + 10,
            left: x - TILE_SIZE / 2,
            zIndex:
              resource.position.y * Z_INDEX.ITEM_OFFSET + Z_INDEX.RESOURCE,
          } as CSSProperties
        }
      >
        <img src="/assets/Resources/Resources/W_Idle.png" />
      </div>

      <div
        className={cn('resource wood absolute overflow-hidden')}
        style={
          {
            top: y - TILE_SIZE + 10,
            left: x - TILE_SIZE / 2,
            zIndex: resource.position.y * Z_INDEX.ITEM_OFFSET + Z_INDEX.TREE,
          } as CSSProperties
        }
      >
        <img src="/assets/Resources/Resources/W_Spawn.png" />
      </div>

      {debug && (
        <div
          className={`absolute border-2 border-yellow-500 text-xs text-white`}
          style={{
            zIndex: Z_INDEX.TREE_DEBUG,
            top: y,
            left: x,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
        >
          {x / TILE_SIZE} - {y / TILE_SIZE}
          <br />
          {resource.willBeLoadedBy ? `p: ${resource.willBeLoadedBy}` : '-'}
        </div>
      )}
    </>
  );
}
