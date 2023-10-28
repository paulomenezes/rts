import { wallKey } from './const.ts';
import { MAP_TYPE, PathfindPoint } from './types.ts';

export function generatePath(
  map: MAP_TYPE[][],
  walls: Record<string, boolean>,
  startPosition: [number, number],
  endPosition: [number, number],
) {
  let grid: PathfindPoint[][] = [];

  let openSet: PathfindPoint[] = [];
  let closedSet: PathfindPoint[] = [];

  let path: PathfindPoint[] = [];

  function heuristic(
    position0: {
      x: number;
      y: number;
    },
    position1: {
      x: number;
      y: number;
    },
  ) {
    let d1 = Math.abs(position1.x - position0.x);
    let d2 = Math.abs(position1.y - position0.y);

    return d1 + d2;
  }

  function createPoint(x: number, y: number, type: MAP_TYPE): PathfindPoint {
    return {
      x: x,
      y: y,
      f: 0,
      g: 0,
      h: 0,
      type,
      neighbors: [],
    };
  }

  function updateNeighbors(point: PathfindPoint, grid: PathfindPoint[][]) {
    let i = point.x;
    let j = point.y;

    const neighbors: PathfindPoint[] = [];

    function addNeighbor(x: number, y: number) {
      if (grid[x][y].type !== 'water' && !walls[wallKey(x, y)]) {
        neighbors.push(grid[x][y]);
      }
    }

    if (i < map.length - 1) {
      addNeighbor(i + 1, j);
    }
    if (i > 0) {
      addNeighbor(i - 1, j);
    }
    if (j < map.length - 1) {
      addNeighbor(i, j + 1);
    }
    if (j > 0) {
      addNeighbor(i, j - 1);
    }

    return neighbors;
  }

  function init() {
    for (let i = 0; i < map.length; i++) {
      const row: PathfindPoint[] = [];

      for (let j = 0; j < map[i].length; j++) {
        row.push(createPoint(i, j, map[i][j]));
      }

      grid.push(row);
    }

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        grid[i][j].neighbors = updateNeighbors(grid[i][j], grid);
      }
    }

    const start = grid[startPosition[0]][startPosition[1]];

    openSet.push(start);
  }

  function search() {
    init();

    while (openSet.length > 0) {
      //assumption lowest index is the first one to begin with
      let lowestIndex = 0;

      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestIndex].f) {
          lowestIndex = i;
        }
      }

      let current = openSet[lowestIndex];

      if (current.x === endPosition[0] && current.y === endPosition[1]) {
        let temp = current;
        path.push(temp);

        while (temp.parent) {
          path.push(temp.parent);
          temp = temp.parent;
        }

        // return the traced path
        return path.reverse();
      }

      //remove current from openSet
      openSet.splice(lowestIndex, 1);

      //add current to closedSet
      closedSet.push(current);

      let neighbors = current.neighbors;

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        if (!closedSet.includes(neighbor)) {
          let possibleG = current.g + 1;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          } else if (possibleG >= neighbor.g) {
            continue;
          }

          neighbor.g = possibleG;
          neighbor.h = heuristic(neighbor, {
            x: endPosition[0],
            y: endPosition[1],
          });
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
        }
      }
    }

    //no solution by default
    return [];
  }

  return search();
}
