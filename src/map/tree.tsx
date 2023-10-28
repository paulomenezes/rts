import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { eventBus } from '../events/event-bus.ts';
import { useGameStore } from '../store/index.tsx';
import { TILE_SIZE } from '../util/const.ts';
import { TreeEntity, TroopEntity } from '../util/types.ts';
import './tree.css';
import { cn } from './utils.ts';

// const WIDTH = 768;
// const HEIGHT = 576;

// const X_SPRITES = 4;
// const Y_SPRITES = 3;

// const TOTAL_SPRITES_HIT = 2;
// const TOTAL_SPRITES_CHOPPED = 1;
// const TOTAL_SPRITES = 4;

// const width = WIDTH / X_SPRITES;
// const height = HEIGHT / Y_SPRITES;

export function Tree({ tree }: { tree: TreeEntity }) {
  const debug = useGameStore((state) => state.debug);
  const hitTree = useGameStore((state) => state.hitTree);
  const troopHitTree = useGameStore((state) => state.troopHitTree);

  const [troopsThatAreCutting, setTroopsThatAreCutting] = useState<string[]>(
    [],
  );

  const isBeingCut = useMemo(
    () => troopsThatAreCutting.length > 0,
    [troopsThatAreCutting],
  );

  const animation: TreeAnimation = useMemo(
    () =>
      tree.health <= 0
        ? TreeAnimation.Chopped
        : isBeingCut
        ? TreeAnimation.Hit
        : TreeAnimation.Idle,
    [tree.health, isBeingCut],
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
        troopHitTree(tree.id, troopsThatAreCutting.length * 10);
        hitTree(tree.id, troopsThatAreCutting.length * 10);
      }, 500);

      return () => {
        clearTimeout(id);
      };
    }
  }, [isBeingCut]);

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
            // '--pos-x': `-${width * spriteCount}px`,
            // '--pos-y': `-${posY}px`,
            // backgroundImage: `url("/assets/Resources/Trees/Tree.png")`,
            // backgroundPosition: `0px -${posY}px`,
            // transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
            // width,
            // height,
            // animation: `play 0.5s steps(${spriteCount}) infinite`,
            top: y - TILE_SIZE * 2,
            left: x - TILE_SIZE,
            zIndex: tree.health > 0 ? 200 : 3,
            WebkitMaskImage: hasTroopsBehind
              ? 'linear-gradient(rgba(0, 0, 0, 0.3), black 80%)'
              : '',
          } as CSSProperties
        }
      >
        <img src="/assets/Resources/Trees/Tree.png" />
      </div>

      {/* <div
        className="absolute"
        style={
          {
            '--pos-x': `-${width * spriteCount}px`,
            '--pos-y': `-${posY}px`,
            backgroundImage: `url("/assets/Resources/Trees/Tree.png")`,
            backgroundPosition: `0px -${posY}px`,
            transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
            width,
            height,
            animation: `play 0.5s steps(${spriteCount}) infinite`,
            top: y - TILE_SIZE * 2,
            left: x - TILE_SIZE,
            zIndex: tree.health > 0 ? 200 : 3,
            WebkitMaskImage: hasTroopsBehind
              ? 'linear-gradient(rgba(0, 0, 0, 0.3), black 80%)'
              : '',
          } as CSSProperties
        }
      ></div> */}

      {debug && (
        <div
          className={`absolute z-[500] border-2 text-xs text-white ${
            tree.reachable ? 'border-green-500' : 'border-blue-500'
          }`}
          style={{
            top: y,
            left: x,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
        >
          {x / TILE_SIZE} - {y / TILE_SIZE} - {tree.health}
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
