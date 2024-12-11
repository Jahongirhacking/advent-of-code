import * as fs from "fs";
import * as path from "path";

const changeNumber = (
  num: number,
  countMap: Record<number, number>,
  oldCountMap: Record<number, number>
) => {
  if (num === 0) {
    countMap[1] = (countMap[1] || 0) + oldCountMap[num];
  } else {
    const len = String(num).length;
    if (len % 2 === 0) {
      const left = Number(String(num).slice(0, len / 2));
      const right = Number(String(num).slice(len / 2));
      countMap[left] = (countMap[left] || 0) + oldCountMap[num];
      countMap[right] = (countMap[right] || 0) + oldCountMap[num];
    } else {
      const newNum = num * 2024;
      countMap[newNum] = (countMap[newNum] || 0) + oldCountMap[num];
    }
  }
};

const solve = (input: string) => {
  const initialNumbers = input.split(" ").map(Number);

  // create map
  let countMap: Record<number, number> = {};
  for (const num of initialNumbers) {
    countMap[num] = (countMap[num] || 0) + 1;
  }

  const numberOfBlinks = 75;

  // calculations
  for (let i = 0; i < numberOfBlinks; i++) {
    const newCountMap = {};
    for (const num of Object.keys(countMap)) {
      changeNumber(Number(num), newCountMap, countMap);
    }
    countMap = newCountMap;
  }

  return Object.values(countMap).reduce(
    (sum, count) => (sum as number) + (count as number),
    0
  );
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
