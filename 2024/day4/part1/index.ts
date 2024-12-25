import * as fs from "fs";
import * as path from "path";

const dynamicSearch = (
  grid: string[][],
  x: number,
  y: number,
  dx: number,
  dy: number,
  target: string
): boolean => {
  for (let i = 0; i < target.length; i += 1) {
    if (!grid[x + dx * i] || !(grid[x + dx * i][y + dy * i] === target[i]))
      return false;
  }
  return true;
};

const solve = (input: string) => {
  const TARGET = "XMAS";
  const grid = input.split("\n").map((row) => row.split(""));
  const height = grid.length;
  const width = grid[0].length;
  const moves = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [1, 1],
    [1, -1],
    [-1, -1],
  ];
  let count = 0;
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      for (const [dx, dy] of moves) {
        count += Number(dynamicSearch(grid, i, j, dx, dy, TARGET));
      }
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
