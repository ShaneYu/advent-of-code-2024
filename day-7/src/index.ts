import { join } from 'node:path';

type Equation = { total: number, values: number[] };

const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();

const equations = input.split('\n').map<Equation>(equation => {
  const [total, rest] = equation.split(': ');
  const values = rest.trim().split(' ').map(Number);

  return { total: +total.trim(), values };
});

const combinationCache = new Map<string, string[][]>();

const getCombinations = (n: number, operators: string[]): string[][] => {
  const cacheKey = `${n}-${operators.join(',')}`;
  if (combinationCache.has(cacheKey)) return combinationCache.get(cacheKey)!;

  const combinations: string[][] = [];

  const generate = (current: string[], depth: number) => {
    if (depth === n) {
      combinations.push([...current]);

      return;
    }

    for (const op of operators) {
      current.push(op);
      generate(current, depth + 1);
      current.pop();
    }
  };

  generate([], 0);

  combinationCache.set(cacheKey, combinations);

  return combinations;
};

// -- [ Part 1 ] --

const evalLeftToRight = (values: number[], combinations: string[]): number => {
  let result = values[0];

  for (let i = 0; i < combinations.length; i++) {
    if (combinations[i] === '+') {
      result += values[i + 1];
    } else if (combinations[i] === '*') {
      result *= values[i + 1];
    }
  }

  return result;
};

const getValidEquations = (equations: Equation[]): Equation[] => equations.filter(({ total, values }) => {
  for (const combination of getCombinations(values.length - 1, ['+', '*'])) {
    if (evalLeftToRight(values, combination) === total) {
      return true;
    }
  }

  return false;
});

const validEquations = getValidEquations(equations);
const sumOfTotals = validEquations.reduce((acc, { total }) => acc + total, 0);

console.log(`Part 1: Sum of valid equations: ${sumOfTotals}`);

// -- [ Part 2 ] --

const evalLeftToRight2 = (values: number[], combinations: string[]): number => {
  let result = values[0];

  for (let i = 0; i < combinations.length; i++) {
    const op = combinations[i];
    const nextVal = values[i + 1];

    if (op === '||') {
      result = Number(String(result) + String(nextVal));
    } else if (op === '+') {
      result += nextVal;
    } else if (op === '*') {
      result *= nextVal;
    }
  }

  return result;
};

const getValidEquations2 = (equations: Equation[]): Equation[] => equations.filter(({ total, values }) => {
  for (const combination of getCombinations(values.length - 1, ['||', '+', '*'])) {
    if (evalLeftToRight2(values, combination) === total) {
      return true;
    }
  }

  return false;
});

const validEquations2 = getValidEquations2(equations);
const sumOfTotals2 = validEquations2.reduce((acc, { total }) => acc + total, 0);

console.log(`Part 2: Sum of valid equations (with || operator): ${sumOfTotals2}`);
