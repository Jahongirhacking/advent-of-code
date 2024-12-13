import * as fs from "fs";
import * as path from "path";

const solve = (input: string) => {
  const machines = input.split("\n\n");
  let tokens = 0;

  for (const machine of machines) {
    const lines = machine.split("\n");
    const [x1, y1] = lines[0]
      .match(/X\+(\d+), Y\+(\d+)/)!
      .slice(1)
      .map(Number);
    const [x2, y2] = lines[1]
      .match(/X\+(\d+), Y\+(\d+)/)!
      .slice(1)
      .map(Number);
    const [c, d] = lines[2]
      .match(/X=(\d+), Y=(\d+)/)!
      .slice(1)
      .map(Number);

    // Cramer's rule
    const denominator = x1 * y2 - y1 * x2;
    if (denominator === 0) continue;

    const a = (c * y2 - d * x2) / denominator;
    const b = (d * x1 - c * y1) / denominator;

    if (Number.isInteger(a) && Number.isInteger(b)) {
      tokens += 3 * a + b;
    }
  }

  return tokens;
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
