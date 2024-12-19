import * as fs from "fs";
import * as path from "path";

const isPossible = (
  patterns: string[],
  design: string,
  memo: Map<string, number>
) => {
  if (design === "") return 1;
  if (memo.has(design)) return memo.get(design);

  let count = 0;
  for (const pattern of patterns) {
    if (design.startsWith(pattern)) {
      count += isPossible(
        patterns,
        design.slice(pattern.length),
        memo
      ) as number;
    }
  }
  memo.set(design, count);
  return count;
};

const solve = (input: string) => {
  let count = 0;
  const [patterns, designs] = input.split("\n\n");
  const patternList = patterns.split(", ");

  for (const design of designs.split("\n")) {
    const memo = new Map<string, number>();
    count += isPossible(patternList, design, memo) as number;
  }

  return count;
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
