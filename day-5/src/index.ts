import { join } from 'node:path';

const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
const [rules, updates] = input.split(/\r?\n\r?\n/);


const ruleMap = new Map<number, number[]>();
rules.split('\n').forEach(rule => {
  const [key, value] = rule.split('|').map(Number);

  ruleMap.set(key, [...(ruleMap.get(key) ?? []), value]);
});


const getMiddlePage = (pages: number[]): number => pages.at(pages.length / 2)!;


const analysis = updates.split('\n').map(update => {
  const pages = update.split(',').map(Number);
  const pageSet = new Set(pages); // For faster lookups
  const result = { pages, middlePage: getMiddlePage(pages), isValid: false };

  for (let i = 1; i < pages.length; i++) {
    const rules = ruleMap.get(pages[i]) ?? [];

    if (rules.some(beforePage => pageSet.has(beforePage) && pages.slice(0, i).includes(beforePage))) {
      return result;
    }
  }

  return { ...result, isValid: true };
});

// -- [ Part 1 ] --

const sumOfMiddlePages = analysis
  .filter(({ isValid }) => isValid)
  .reduce((acc, { middlePage }) => acc + middlePage, 0);

console.log(`Part 1: Sum of middle page numbers: ${sumOfMiddlePages}\n`);

// -- [ Part 2 ] --

const fixedUpdates = analysis
  .filter(({ isValid }) => !isValid)
  .map(({ pages }) => {
    const fixedPages = pages.toSorted((a, b) => (ruleMap.get(b) ?? []).includes(a) ? 1 : -1);

    return { pages: fixedPages, middlePage: getMiddlePage(fixedPages), isValid: true };
  });

const sumOfMiddlePagesForFixedUpdates = fixedUpdates.reduce(
  (acc, { middlePage }) => acc + middlePage,
  0
);

console.log(
  `Part 2: Sum of middle page numbers (of fixed updates): ${sumOfMiddlePagesForFixedUpdates}\n`
);
