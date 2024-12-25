import * as fs from "fs";
import * as path from "path";

const solve = (input: string) => {
  const TARGET = "MAS";
  const grid = input.split("\n").map((row) => row.split(""));
  const height = grid.length;
  const width = grid[0].length;
  let count = 0;
  for (let i = 0; i <= height - TARGET.length; i += 1) {
    for (let j = 0; j <= width - TARGET.length; j += 1) {
      let d1 = "",
        d2 = "";
      for (let k = 0; k < TARGET.length; k += 1) {
        d1 += grid[i + k][j + k];
        d2 += grid[i + k][j + 2 - k];
      }
      count += Number(
        (d1 === TARGET || d1 === TARGET.split("").reverse().join("")) &&
          (d2 === TARGET || d2 === TARGET.split("").reverse().join(""))
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
