import { join } from 'node:path';

const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
const [rules, updates] = input.split(/\r?\n\r?\n/);

const ruleMap = new Map<number, number[]>();

rules.split('\n').forEach((rule) => {
  const [key, value] = rule.split('|').map(Number);
  
  if (!ruleMap.has(key)) {
    ruleMap.set(key, []);
  }

  ruleMap.get(key)!.push(value);
});

const getMiddlePage = (pages: number[]): number => pages.at(pages.length / 2)!;

const analysis = updates.split('\n').map((update) => {
  const pages = update.split(',').map(Number);
  const result = { pages, middlePage: getMiddlePage(pages), isValid: false };

  for (let i = 1; i < pages.length; i++) {
    if (ruleMap.has(pages[i])) {
      for (const beforePage of ruleMap.get(pages[i])!) {
        if (pages.includes(beforePage) && pages.slice(0, i).includes(beforePage)) {
          return result;
        }
      }
    }
  }

  return { ...result, isValid: true };
});

// -- [ Part 1 ] --

const sumOfMiddlePages = analysis.filter(x => x.isValid).reduce((acc, x) => acc + x.middlePage, 0);

console.log(`Part 1: Sum of middle page numbers: ${sumOfMiddlePages}\n`);

// -- [ Part 2 ] --

const invalidUpdates = analysis.filter(x => !x.isValid);

const fixedUpdates = invalidUpdates.map((update) => {
  const fixedPages = update.pages.toSorted((a, b) => {
    if (!ruleMap.has(b)) {
      return -1;
    }

    if (ruleMap.get(b)!.includes(a)) {
      return 1;
    }

    return -1;
  });

  return {
    pages: fixedPages,
    middlePage: getMiddlePage(fixedPages),
    isValid: true
  }
});

const sumOfMiddlePagesForFixedUpdates = fixedUpdates.reduce((acc, x) => acc + x.middlePage, 0);

console.log(`Part 2: Sum of middle page numbers (of fixed updates): ${sumOfMiddlePagesForFixedUpdates}\n`);
