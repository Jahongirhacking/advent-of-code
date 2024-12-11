import * as fs from "fs";
import * as path from "path";

function solve(input: string) {
  const regex = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g;
  let match;
  let sum = 0;
  let enabled = true;
  while ((match = regex.exec(input)) !== null) {
    if (match[0] === "do()") {
      enabled = true;
    } else if (match[0] === "don't()") {
      enabled = false;
    } else if (match[1] && match[2] && enabled) {
      const x = parseInt(match[1], 10);
      const y = parseInt(match[2], 10);
      sum += x * y;
    }
  }
  return sum;
}

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
