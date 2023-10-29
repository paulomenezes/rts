import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { eventBus } from '../events/event-bus.ts';
import { useGameStore } from '../store/index.tsx';
import { TILE_SIZE, Z_INDEX } from '../util/const.ts';
import { TreeEntity, TroopEntity } from '../util/types.ts';
import './tree.css';
import { cn } from '../util/functions.ts';

export function Tree({ tree }: { tree: TreeEntity }) {
  const debug = useGameStore((state) => state.debug);
  const chopTree = useGameStore((state) => state.chopTree);
  const cutTree = useGameStore((state) => state.cutTree);

  const [health, setHealth] = useState(tree.health);

  const [troopsThatAreCutting, setTroopsThatAreCutting] = useState<string[]>(
    [],
  );

  const isBeingCut = useMemo(
    () => troopsThatAreCutting.length > 0,
    [troopsThatAreCutting],
  );

  const animation: TreeAnimation = useMemo(
    () =>
      health <= 0
        ? TreeAnimation.Chopped
        : isBeingCut
        ? TreeAnimation.Hit
        : TreeAnimation.Idle,
    [health, isBeingCut],
  );

  const x = useMemo(() => tree.position.x * TILE_SIZE, [tree.position.x]);
  const y = useMemo(() => tree.position.y * TILE_SIZE, [tree.position.y]);

  useEffect(() => {
    function startCutting({ troop }: { troop: TroopEntity }) {
      if (troop.chopTreeId === tree.id) {
        setTroopsThatAreCutting((prev) => [...new Set([...prev, troop.id])]);
      }
    }

    function stopCutting({ troop }: { troop: TroopEntity }) {
      if (troop.chopTreeId === tree.id) {
        setTroopsThatAreCutting((prev) => prev.filter((id) => id !== troop.id));
      }
    }

    eventBus.on('start-cutting', startCutting);
    eventBus.on('stop-cutting', stopCutting);

    return () => {
      eventBus.remove('start-cutting', startCutting);
      eventBus.remove('stop-cutting', stopCutting);
    };
  }, []);

  useEffect(() => {
    if (isBeingCut) {
      const id = setInterval(() => {
        setHealth((prev) => {
          const newHealth = Math.max(
            0,
            prev - troopsThatAreCutting.length * 10,
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
      chopTree(tree.id);
      cutTree(tree.id);

      setTroopsThatAreCutting([]);
    }
  }, [health]);

  const hasTroopsBehind = useGameStore((state) =>
    state.troops.some(
      (troop) =>
        troop.position.x / TILE_SIZE === tree.position.x &&
        troop.position.y / TILE_SIZE === tree.position.y - 1,
    ),
  );

  return (
    <>
      <div
        className={cn('tree absolute overflow-hidden', {
          idle: animation === TreeAnimation.Idle,
          hit: animation === TreeAnimation.Hit,
          chopped: animation === TreeAnimation.Chopped,
        })}
        style={
          {
            top: y - TILE_SIZE * 2,
            left: x - TILE_SIZE,
            zIndex: tree.position.y * Z_INDEX.ITEM_OFFSET + Z_INDEX.TREE,
            WebkitMaskImage: hasTroopsBehind
              ? 'linear-gradient(rgba(0, 0, 0, 0.3), black 80%)'
              : '',
          } as CSSProperties
        }
      >
        <img src="/assets/Resources/Trees/Tree.png" />
      </div>

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
