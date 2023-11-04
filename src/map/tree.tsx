import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../store/index.tsx';
import { MAP_SIZE, TILE_SIZE, Z_INDEX } from '../util/const.ts';
import { TreeEntity } from '../util/types.ts';
import './tree.css';
import { useHasTroopBehind } from '../hooks/use-has-troop-behind.tsx';
import { cn } from '../util/functions.ts';

export function Tree({ tree }: { tree: TreeEntity }) {
  const debug = useGameStore((state) => state.debug);
  const chopTree = useGameStore((state) => state.chopTree);
  const cutTree = useGameStore((state) => state.cutTree);
  const addResource = useGameStore((state) => state.addResource);

  const [health, setHealth] = useState(tree.health);

  const troopsThatAreCutting = useMemo(
    () => tree.troopsChopping,
    [tree.troopsChopping],
  );

  const isBeingCut = useMemo(
    () => troopsThatAreCutting.length > 0,
    [troopsThatAreCutting],
  );

  const animation: TreeAnimation = useMemo(
    () =>
      health <= 10
        ? TreeAnimation.Chopped
        : isBeingCut
        ? TreeAnimation.Hit
        : TreeAnimation.Idle,
    [health, isBeingCut],
  );

  const x = useMemo(() => tree.position.x * TILE_SIZE, [tree.position.x]);
  const y = useMemo(() => tree.position.y * TILE_SIZE, [tree.position.y]);

  useEffect(() => {
    if (isBeingCut) {
      const id = setInterval(() => {
        setHealth((prev) => {
          const newHealth = Math.max(
            0,
            prev - troopsThatAreCutting.length * 100,
          );

          if (newHealth === 0) {
            clearInterval(id);
          }

          return newHealth;
        });
      }, 500);

      return () => {
        clearTimeout(id);
      };
    }
  }, [isBeingCut]);

  useEffect(() => {
    if (health === 0) {
      if (troopsThatAreCutting.length > 0) {
        addResource(troopsThatAreCutting[0], tree.position);
      }

      chopTree(tree.id);
      cutTree(tree.id);
    }
  }, [health]);

  useEffect(() => {
    if (health === 0 && troopsThatAreCutting.length === 0) {
      useGameStore.getState().removeTree(tree.id);
    }
  }, [health, troopsThatAreCutting]);

  const hasTroopsBehind = useHasTroopBehind(tree.position, {
    topOffset: 2,
  });

  const spriteCount = useMemo(
    () =>
      animation === TreeAnimation.Idle
        ? 4
        : animation === TreeAnimation.Hit
        ? 2
        : 1,
    [animation],
  );

  const spriteYPosition = animation * (576 / 3);

  if (tree.health === 0) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'absolute overflow-hidden',
          // {
          //   idle: animation === TreeAnimation.Idle,
          //   hit: animation === TreeAnimation.Hit,
          //   chopped: animation === TreeAnimation.Chopped,
          // }
        )}
        style={
          {
            '--pos-x': `-${192 * spriteCount}px`,
            '--pos-y': `-${spriteYPosition}px`,
            backgroundImage: 'url(/assets/Resources/Trees/Tree.png)',
            backgroundPosition: `0px -${spriteYPosition}px`,
            animation: `play 0.5s steps(${spriteCount}) infinite`,
            width: 192,
            height: 192,
            top: y - TILE_SIZE * 2,
            left: x - TILE_SIZE,
            zIndex: tree.position.y * Z_INDEX.ITEM_OFFSET + Z_INDEX.TREE,
            WebkitMaskImage: hasTroopsBehind
              ? 'linear-gradient(rgba(0, 0, 0, 0.3), black 80%)'
              : '',
          } as CSSProperties
        }
      />

      {(troopsThatAreCutting.length > 0 || health < 100) && (
        <div
          className="absolute flex justify-center"
          style={{
            top: y - TILE_SIZE * 2 + 180,
            left: x - TILE_SIZE + 192 / 2 - 56 / 2,
            zIndex: MAP_SIZE * 10000,
          }}
        >
          <div className="h-3 w-14 border-2">
            <div
              className="h-full bg-red-500"
              style={{
                width: `${(health / 100) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {debug && (
        <div
          className={`absolute border-2 text-xs text-white ${
            tree.reachable ? 'border-green-500' : 'border-blue-500'
          }`}
          style={{
            zIndex: Z_INDEX.TREE_DEBUG,
            top: y,
            left: x,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
        >
          {health} - {tree.position.y * Z_INDEX.ITEM_OFFSET + Z_INDEX.TREE}
        </div>
      )}
    </>
  );
}

export enum TreeAnimation {
  Idle = 0,
  Hit = 1,
  Chopped = 2,
}
