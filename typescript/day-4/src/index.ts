import { join } from 'node:path';

const grid = (await Bun.file(join(import.meta.dir, 'input_sample.txt')).text()).split('\n').map(row => row.split(''));

// -- [ Part 1 ] --

const wordToFind = 'XMAS';

let occurrencesFound = 0;

const directions = [
  [0, 1],   // Right
  [0, -1],  // Left
  [1, 0],   // Down
  [-1, 0],  // Up
  [1, 1],   // Diagonal Down-Right
  [-1, -1], // Diagonal Up-Left
  [1, -1],  // Diagonal Down-Left
  [-1, 1],  // Diagonal Up-Right
];

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    for (const [rowDelta, colDelta] of directions) {
      let match = true;

      for (let i = 0; i < wordToFind.length; i++) {
        const newRow = row + i * rowDelta;
        const newCol = col + i * colDelta;

        if (
          newRow < 0 || newRow >= grid.length ||
          newCol < 0 || newCol >= grid[row].length ||
          grid[newRow][newCol] !== wordToFind[i]
        ) {
          match = false;
          break;
        }
      }

      if (match) {
        occurrencesFound++;
      }
    }
  }
}

console.log(`Part 1: Found ${occurrencesFound} occurrences of word XMAS in the grid.`);

// -- [ Part 2 ] --

for (let row = 1; row < grid.length - 1; row++) {
    for (let col = 1; col < grid[row].length - 1; col++) {
        if (grid[row][col] !== 'A') {
            continue;
        }

        if ((grid[row - 1][col - 1] !== 'M' || grid[row + 1][col + 1] !== 'S') && (grid[row - 1][col - 1] !== 'S' || grid[row + 1][col + 1] !== 'M')) {
            continue;
        }

        if ((grid[row - 1][col + 1] !== 'M' || grid[row + 1][col - 1] !== 'S') && (grid[row - 1][col + 1] !== 'S' || grid[row + 1][col - 1] !== 'M')) {
            continue;
        }

        occurrencesFound++;
    }
}

console.log(`Part 2: Found ${occurrencesFound} occurrences of MAS in X shape within the grid.`);
