import { useGameStore } from '../store/index.tsx';
import { MAP_SIZE, TILE_SIZE } from './const.ts';
import { calculateDistance, findClosest } from './functions.ts';
import { generatePath } from './generate-path.ts';
import { PawnAnimation, Position, TroopEntity } from './types.ts';

export function moveTroops(
  troops: TroopEntity[],
  position: Position,
): TroopEntity[] {
  const map = useGameStore.getState().map;
  const walls = useGameStore.getState().walls;

  const centerDestX = Math.floor(position.x / TILE_SIZE);
  const centerDestY = Math.floor(position.y / TILE_SIZE);

  return troops.map((troop) => {
    let destX = centerDestX;
    let destY = centerDestY;

    const destXTile = destX * TILE_SIZE + TILE_SIZE / 2;
    const destYTile = destY * TILE_SIZE + TILE_SIZE / 2;

    // check if destination is water and if so, find the closest ground tile
    if (map[destX]?.[destY] === 'water') {
      let closestX = destX;
      let closestY = destY;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (let x = 0; x < MAP_SIZE; x++) {
        for (let y = 0; y < MAP_SIZE; y++) {
          if (map[x][y] !== 'water') {
            const distance = calculateDistance(
              { x: destX, y: destY },
              { x, y },
            );

            if (distance < closestDistance) {
              closestDistance = distance;
              closestX = x;
              closestY = y;
            }
          }
        }
      }

      destX = closestX;
      destY = closestY;
    }

    const path = generatePath(
      map,
      walls,
      [
        Math.floor(troop.position.x / TILE_SIZE),
        Math.floor(troop.position.y / TILE_SIZE),
      ],
      [destX, destY],
    ).map((path) => ({
      ...path,
      x: path.x * TILE_SIZE + TILE_SIZE / 2,
      y: path.y * TILE_SIZE + TILE_SIZE / 2,
    }));

    if (path && path.length > 1) {
      return {
        ...troop,
        destination: {
          x: destXTile,
          y: destYTile,
        },
        animation:
          troop.carryAmount > 0 ? PawnAnimation.CarryRun : PawnAnimation.Walk,
        path,
        pathIndex: 1,
      };
    }

    return troop;
  });
}

export function moveTroopsForTree(
  troops: TroopEntity[],
  position: Position,
): TroopEntity[] {
  const map = useGameStore.getState().map;
  const trees = useGameStore.getState().trees;
  const walls = useGameStore.getState().walls;

  const threshold = Math.floor(Math.sqrt(troops.length) / 2);
  let x = -threshold;
  let y = x;

  const positionMap: Record<string, { x: number; y: number }> = {};

  for (let i = 0; i < troops.length; i++) {
    positionMap[troops[i].id] = { x, y };
    x++;

    if (x > threshold) {
      x = -threshold;
      y++;
    }
  }

  const centerDestX = Math.floor(position.x / TILE_SIZE);
  const centerDestY = Math.floor(position.y / TILE_SIZE);

  let destinationTree = trees.find(
    (tree) =>
      tree.position.x === centerDestX &&
      tree.position.y === centerDestY &&
      tree.health > 0,
  );

  return troops.map((troop) => {
    let destX =
      centerDestX + (destinationTree ? 0 : positionMap[troop.id]?.x ?? 0);
    let destY =
      centerDestY + (destinationTree ? 0 : positionMap[troop.id]?.y ?? 0);

    const destXTile = destX * TILE_SIZE + TILE_SIZE / 2;
    const destYTile = destY * TILE_SIZE + TILE_SIZE / 2;

    if (destinationTree) {
      destinationTree = findClosest(
        trees,
        { x: destX, y: destY },
        (tree) => tree.reachable && tree.health > 0,
      );

      console.log(destinationTree);

      const closestX = destinationTree?.position.x || destX;
      const closestY = destinationTree?.position.y || destY;

      // find the closest reachable tree
      // let closestX = destX;
      // let closestY = destY;
      // let closestDistance = Infinity;

      // for (const tree of trees) {
      //   if (tree.reachable) {
      //     const distance = Math.sqrt(
      //       (destX - tree.position.x) * (destX - tree.position.x) +
      //         (destY - tree.position.y) * (destY - tree.position.y),
      //     );

      //     if (distance < closestDistance) {
      //       closestDistance = distance;
      //       closestX = tree.position.x;
      //       closestY = tree.position.y;
      //     }
      //   }
      // }

      // destinationTree = trees.find(
      //   (tree) => tree.position.x === closestX && tree.position.y === closestY,
      // );

      destY = closestY;

      let delta = 0;

      if (destinationTree?.reachableDirection === 'both') {
        delta = closestX - troop.position.x / TILE_SIZE < 0 ? 1 : -1;
      } else {
        delta = destinationTree?.reachableDirection === 'left' ? -1 : 1;
      }

      destX = closestX + delta;
    } else {
      // check if destination is water and if so, find the closest ground tile
      if (map[destX]?.[destY] === 'water') {
        let closestX = destX;
        let closestY = destY;
        let closestDistance = Infinity;

        for (let x = 0; x < MAP_SIZE; x++) {
          for (let y = 0; y < MAP_SIZE; y++) {
            if (map[x][y] !== 'water') {
              const distance = Math.sqrt(
                (destX - x) * (destX - x) + (destY - y) * (destY - y),
              );

              if (distance < closestDistance) {
                closestDistance = distance;
                closestX = x;
                closestY = y;
              }
            }
          }
        }

        destX = closestX;
        destY = closestY;
      }
    }

    const path = generatePath(
      map,
      walls,
      [
        Math.floor(troop.position.x / TILE_SIZE),
        Math.floor(troop.position.y / TILE_SIZE),
      ],
      [destX, destY],
    ).map((path) => ({
      ...path,
      x: path.x * TILE_SIZE + TILE_SIZE / 2,
      y: path.y * TILE_SIZE + TILE_SIZE / 2,
    }));

    if (path && path.length > 0) {
      return {
        ...troop,
        chopTreeId: destinationTree?.id,
        destinationAction: destinationTree ? 'chop' : undefined,
        destination: {
          x: destXTile,
          y: destYTile,
        },
        animation:
          troop.carryAmount > 0 ? PawnAnimation.CarryRun : PawnAnimation.Walk,
        path,
        pathIndex: 1,
      };
    }

    return troop;
  });
}

export function moveTroopsForResource(
  troops: TroopEntity[],
  position: Position,
): TroopEntity[] {
  const map = useGameStore.getState().map;
  const resources = useGameStore.getState().resources;
  const walls = useGameStore.getState().walls;

  const centerDestX = Math.floor(position.x / TILE_SIZE);
  const centerDestY = Math.floor(position.y / TILE_SIZE);

  let destinationResource = resources.find(
    (tree) =>
      tree.position.x === centerDestX && tree.position.y === centerDestY,
  );

  return troops.map((troop) => {
    let destX = centerDestX;
    let destY = centerDestY;

    const destXTile = destX * TILE_SIZE + TILE_SIZE / 2;
    const destYTile = destY * TILE_SIZE + TILE_SIZE / 2;

    // if (destinationResource) {
    //   // find the closest reachable tree
    //   let closestX = destX;
    //   let closestY = destY;
    //   let closestDistance = Infinity;

    //   for (const resource of resources) {
    //     if (resource.position.x !== troop.position.x)
    //     const distance = Math.sqrt(
    //       (destX - resource.position.x) * (destX - resource.position.x) +
    //         (destY - resource.position.y) * (destY - resource.position.y),
    //     );

    //     if (distance < closestDistance) {
    //       closestDistance = distance;
    //       closestX = resource.position.x;
    //       closestY = resource.position.y;
    //     }
    //   }

    //   destinationResource = resources.find(
    //     (tree) => tree.position.x === closestX && tree.position.y === closestY,
    //   );

    //   console.log('destinationResource', destinationResource);

    //   destY = closestY;
    //   destX = closestX;
    // }

    const path = generatePath(
      map,
      walls,
      [
        Math.floor(troop.position.x / TILE_SIZE),
        Math.floor(troop.position.y / TILE_SIZE),
      ],
      [destX, destY],
    ).map((path) => ({
      ...path,
      x: path.x * TILE_SIZE + TILE_SIZE / 2,
      y: path.y * TILE_SIZE + TILE_SIZE / 2,
    }));

    console.log(path);

    if (path && path.length > 1) {
      return {
        ...troop,
        // chopTreeId: destinationResource?.id,
        destinationAction: destinationResource ? 'resource' : undefined,
        destination: {
          x: destXTile,
          y: destYTile,
        },
        animation:
          troop.carryAmount > 0 ? PawnAnimation.CarryRun : PawnAnimation.Walk,
        path,
        pathIndex: 1,
      };
    }

    return troop;
  });
}
