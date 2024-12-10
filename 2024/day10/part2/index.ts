import * as fs from "fs";
import * as path from "path";

const solve = (input: string) => {
  const lines = input.split("\n");
  const grid = [];
  for (const line of lines) {
    grid.push(line.split("").map(Number));
  }
  const height = grid.length;
  const width = grid[0].length;
  // find 0 index
  const indexesOfTrailHead = [];
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (grid[i][j] === 0) indexesOfTrailHead.push([i, j]);
    }
  }
  // traverse and calculate
  const moves = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let sum = 0;
  for (let indexOfTrailHead of indexesOfTrailHead) {
    const queue = [indexOfTrailHead];
    while (queue.length) {
      const [i, j] = queue.shift() as [number, number];
      if (grid[i][j] === 9) {
        sum += 1;
        continue;
      }
      for (let [iMove, jMove] of moves) {
        if (
          i + iMove < height &&
          i + iMove >= 0 &&
          j + jMove < width &&
          j + jMove >= 0 &&
          grid[i + iMove][j + jMove] !== undefined &&
          grid[i][j] + 1 === grid[i + iMove][j + jMove]
        ) {
          queue.push([i + iMove, j + jMove]);
        }
      }
    }
  }
  return sum;
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
