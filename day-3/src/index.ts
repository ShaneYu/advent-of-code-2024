import { join } from 'node:path';

const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();

// -- [ Part 1 ] --

const nonCorruptedValue = input.matchAll(/mul\((\d+),(\d+)\)/gi).reduce((acc, match) => acc + (+match[1] * +match[2]), 0);

console.log(`Part 1: The non-corrupted value is ${nonCorruptedValue}`);

// -- [ Part 2 ] --

let includeCalc = true;
const calcs = [...input.matchAll(/(?<cmd>do|don't|mul)\((?:(?<num1>\d+),(?<num2>\d+))?\)/gi)]
  .filter(match => {
    const { cmd, num1, num2 } = match.groups!;

    if (cmd === 'do') includeCalc = true;
    if (cmd === "don't") includeCalc = false;

    return includeCalc && cmd === 'mul' && num1 && num2;
  })
  .map(match => +match.groups!['num1'] * +match.groups!['num2']);

const nonCorruptedValueImproved = calcs.reduce((acc, calc) => acc + calc, 0);

console.log(`Part 2: The non-corrupted value is ${nonCorruptedValueImproved}`);
