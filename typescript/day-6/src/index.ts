import { join } from 'node:path';

const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
const inputGrid = input.split('\n').map(row => row.split(''));

const directions = new Map<string, { y: number, x: number, nextDirection: string }>([
  ['^', { y: -1, x: 0, nextDirection: '>' }],
  ['>', { y: 0, x: 1, nextDirection: 'v' }],
  ['v', { y: 1, x: 0, nextDirection: '<' }],
  ['<', { y: 0, x: -1, nextDirection: '^' }],
]);

const isObstacle = (grid: string[][], position: { x: number, y: number }) =>
  grid[position.y][position.x] === '#' || grid[position.y][position.x] === 'O';

const getGuardPosition = (grid: string[][]) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (directions.has(grid[y][x])) {
        return { x, y, direction: grid[y][x] };
      }
    }
  }

  throw new Error('Guard position not found');
};

const isInBounds = (grid: string[][], position: { x: number, y: number }) =>
  position.y >= 0 && position.y < grid.length && position.x >= 0 && position.x < grid[position.y].length;

// -- [ Part 1 ] --

const simulatePart1 = (): [string[][], number] => {
  const grid = inputGrid.map(row => [...row])
  let guardPosition = getGuardPosition(grid);
  let visitedPositions = 1;

  while (isInBounds(grid, guardPosition)) {
    const { x, y, direction } = guardPosition;

    const nextPosition = {
      x: x + directions.get(direction)!.x,
      y: y + directions.get(direction)!.y,
    };

    grid[y][x] = 'X';

    if (!isInBounds(grid, nextPosition)) {
      break;
    }

    if (isObstacle(grid, nextPosition)) {
      guardPosition = { x, y, direction: directions.get(direction)!.nextDirection };
      grid[y][x] = guardPosition.direction;

      continue;
    }

    if (grid[nextPosition.y][nextPosition.x] === '.') {
      visitedPositions++;
    }

    guardPosition = { ...nextPosition, direction };
    grid[nextPosition.y][nextPosition.x] = direction;
  }

  return [grid, visitedPositions];
};

const [result, visitedPositions] = simulatePart1();

// console.log(result.map(row => row.join('')).join('\n'));
console.log(`Part 1: Number of visited positions: ${visitedPositions}\n`);


// -- [ Part 2 ] --

const toTrackedPositionKey = (position: { x: number, y: number, direction: string }) =>
  `${position.x},${position.y},${position.direction}`;

const isLoop = (trackedPositions: Set<string>, position: { x: number, y: number, direction: string }) =>
  trackedPositions.has(toTrackedPositionKey(position));

const simulatePart2 = (placeObstructionAtPos: { x: number, y: number }): [string[][], boolean] => {
  const grid = inputGrid.map(row => [...row]);

  grid[placeObstructionAtPos.y][placeObstructionAtPos.x] = 'O';

  let guardPosition = getGuardPosition(grid);
  const trackedPositions = new Set<string>();

  while (isInBounds(grid, guardPosition)) {
    const { x, y, direction } = guardPosition;

    const nextPosition = {
      x: x + directions.get(direction)!.x,
      y: y + directions.get(direction)!.y,
    };

    grid[y][x] = 'X';

    if (!isInBounds(grid, nextPosition)) {
      break;
    }

    if (isObstacle(grid, nextPosition)) {
      guardPosition = { x, y, direction: directions.get(direction)!.nextDirection };
      grid[y][x] = guardPosition.direction;

      if (isLoop(trackedPositions, guardPosition)) {
        return [grid, true];
      }

      trackedPositions.add(toTrackedPositionKey(guardPosition));

      continue;
    }

    trackedPositions.add(toTrackedPositionKey(guardPosition));

    guardPosition = { ...nextPosition, direction };
    grid[nextPosition.y][nextPosition.x] = direction;

    if (isLoop(trackedPositions, guardPosition)) {
      return [grid, true];
    }
  }

  return [grid, false];
};

let validObstructionPositions: { x: number, y: number }[] = [];

for (let y = 0; y < inputGrid.length; y++) {
  for (let x = 0; x < inputGrid[y].length; x++) {
    if (inputGrid[y][x] !== '.') {
      continue;
    }

    const [_, loopDetected] = simulatePart2({ x, y });

    if (loopDetected) {
      validObstructionPositions.push({ x, y });
      // console.log(`\n${result.map(row => row.join('')).join('\n')}\n`);
    }
  }
}

console.log(`Part 2: Number of valid obstruction positions: ${validObstructionPositions.length}`);
