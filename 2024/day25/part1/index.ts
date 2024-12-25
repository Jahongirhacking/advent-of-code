import * as fs from "fs";
import * as path from "path";

const solve = (input: string) => {
  const schematics = input.split("\n\n");
  const locks: number[][] = [];
  const keys: number[][] = [];
  for (const schema of schematics) {
    const grid = schema.split("\n").map((row) => row.split(""));
    const height = grid.length;
    const width = grid[0].length;
    const isLock = grid[0][0] === "#";
    // collect schematics
    const arr = Array.from({ length: width }).fill(0) as number[];
    for (let j = 0; j < width; j += 1) {
      for (let i = 1; i < height - 1; i += 1) {
        if (grid[i][j] === "#") arr[j] += 1;
      }
    }
    if (isLock) {
      locks.push([...arr]);
    } else {
      keys.push([...arr]);
    }
  }
  // calculations
  let count = 0;
  for (const lock of locks) {
    for (const key of keys) {
      count += Number(
        lock.reduce((acc, curr, index) => acc && curr + key[index] <= 5, true)
      );
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
