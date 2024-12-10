import { join } from 'node:path';

let occurrencesFound = 0;

const grid = (await Bun.file(join(import.meta.dir, 'input.txt')).text()).split('\n').map(row => row.split(''));

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

console.log(`Found ${occurrencesFound} occurrences of X-MAS in the grid.`);
