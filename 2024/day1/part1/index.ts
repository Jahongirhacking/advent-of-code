import * as fs from "fs";
import * as path from "path";

function solve(input: string) {
  const lines = input.split("\n");
  const left: number[] = [];
  const right: number[] = [];
  for (const line of lines) {
    const splitted = line.split("  ").map(Number);
    left.push(splitted[0]);
    right.push(splitted[1]);
  }
  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);
  return left.reduce(
    (acc, curr, index) => acc + Math.abs(curr - right[index]),
    0
  );
}

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
