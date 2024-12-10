import { join } from 'node:path';

const getSortedLists = (input: string) => input
.trim()
.split('\n')
.map(line => line.trim().split('   ').map(Number))
.reduce<[number[], number[]]>(
  ([aList, bList], [a, b]) => ([ [...aList, a], [...bList, b] ]),
  [[], []]
)
.map(list => list.toSorted((a, b) => a - b));


const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
const [listA, listB] = getSortedLists(input);
const distances = listA.map((a, i) => Math.abs(a - listB[i]));

// -- [ Part 1 ] --

const totalDistance = distances.reduce((acc, distance) => acc + distance, 0);

console.log(`Part 1: Total Distance: ${totalDistance}`);

// -- [ Part 2 ] --

const similarityScore = listA.map((a) => listB.filter(b => b === a).length * a).reduce((acc, score) => acc + score, 0);

console.log(`Part 2: Similarity Score: ${similarityScore}`);
