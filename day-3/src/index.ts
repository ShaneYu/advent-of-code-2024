import { join } from 'node:path';

const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();

let includeCalc = true;
const calcs = [...input.matchAll(/(?<cmd>do|don't|mul)\((?:(?<num1>\d+),(?<num2>\d+))?\)/gi)]
  .filter(match => {
    const { cmd, num1, num2 } = match.groups!;

    if (cmd === 'do') includeCalc = true;
    if (cmd === "don't") includeCalc = false;

    return includeCalc && cmd === 'mul' && num1 && num2;
  })
  .map(match => +match.groups!['num1'] * +match.groups!['num2']);

const nonCorruptedValue = calcs.reduce((acc, calc) => acc + calc, 0);

console.log(`The non-corrupted value is ${nonCorruptedValue}`);
