import * as fs from "fs";
import * as path from "path";

const isPossible = (
  patterns: string[],
  design: string,
  memo: Map<string, boolean>
) => {
  if (design === "") return true;
  if (memo.has(design)) return memo.get(design);

  for (const pattern of patterns) {
    if (design.startsWith(pattern)) {
      if (isPossible(patterns, design.slice(pattern.length), memo)) {
        memo.set(design, true);
        return true;
      }
    }
  }
  memo.set(design, false);
  return false;
};

const solve = (input: string) => {
  let count = 0;
  const [patterns, designs] = input.split("\n\n");
  const patternList = patterns.split(", ");

  for (const design of designs.split("\n")) {
    const memo = new Map<string, boolean>();
    if (isPossible(patternList, design, memo)) {
      count += 1;
    }
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
