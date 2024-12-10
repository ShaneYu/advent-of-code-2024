import { join } from 'node:path';

const MAX_DIFFERENCE = 3;

const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();

const reportData = input
  .split('\n')
  .map(line => line.trim().split(' ').map(Number));

const allPositiveOrNegative = (data: number[]) =>
  data.every(level => level > 0) || data.every(level => level < 0);

const diffNoGreaterThanThree = (data: number[]) =>
  data.every((level, i, arr) => i === 0 || Math.abs(level - arr[i - 1]) <= MAX_DIFFERENCE);

const calculateDifferences = (data: number[]) =>
  data.slice(1).map((level, i) => level - data[i]);


// -- [ Part 1 ] --

const safeReports = reportData.filter(data => {
  const differences = calculateDifferences(data);

  return allPositiveOrNegative(differences) && diffNoGreaterThanThree(data);
}).length;

console.log(`Part 1: Total "safe" reports: ${safeReports}`);


// -- [ Part 2 ] --

const isValidAfterRemovingOne = (data: number[]) => {
  for (let i = 0; i < data.length; i++) {
    const filteredData = data.filter((_, index) => index !== i);
    const differences = calculateDifferences(filteredData);

    if (allPositiveOrNegative(differences) && diffNoGreaterThanThree(filteredData)) {
      return true;
    }
  }

  return false;
};

const safeReportsWithDampening = reportData.filter(data => {
  const differences = calculateDifferences(data);

  return (
    (allPositiveOrNegative(differences) && diffNoGreaterThanThree(data)) ||
    isValidAfterRemovingOne(data)
  );
}).length;

console.log(`Part 2: Total "safe" reports: ${safeReportsWithDampening}`);
