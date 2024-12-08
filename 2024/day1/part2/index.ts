import * as fs from "fs";
import * as path from "path";

function solve(input: string) {
  const lines = input.split("\n");
  const left: number[] = [];
  const right = new Map<number, number>();
  for (const line of lines) {
    const [key, value] = line.split("  ").map(Number);
    left.push(key);
    // map work
    if (right.has(value)) {
      right.set(value, (right.get(value) as number) + 1);
    } else {
      right.set(value, 1);
    }
  }
  return left.reduce((acc, curr) => acc + curr * (right.get(curr) ?? 0), 0);
}

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
