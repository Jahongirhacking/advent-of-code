import * as fs from "fs";
import * as path from "path";

const getClonedGrid = (grid: string[][]) => {
  const arr = [];
  for (const line of grid) arr.push([...line]);
  return arr;
};

const solve = (input: string) => {
  const lines = input.split("\n");
  // create grid
  const grid = [];
  for (const line of lines) {
    grid.push(line.split(""));
  }
  const height = grid.length;
  const width = grid[0].length;
  const CHECKED = "CHECKED";
  const moves = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let sum = 0;
  const clonedGrid = getClonedGrid(grid);

  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      const temp = grid[i][j];
      let area = 0,
        perimeter = 0;
      // BFS
      const queue: [number, number][] = [[i, j]];
      while (queue.length) {
        const [tempI, tempJ] = queue.shift() as [number, number];
        if (grid[tempI][tempJ] === CHECKED) continue;
        area += 1;
        for (const [moveI, moveJ] of moves) {
          const nextI = tempI + moveI;
          const nextJ = tempJ + moveJ;
          if (
            nextI < height &&
            nextI >= 0 &&
            nextJ < width &&
            nextJ >= 0 &&
            clonedGrid[nextI][nextJ] === temp
          ) {
            if (grid[nextI][nextJ] === CHECKED) continue;
            queue.push([nextI, nextJ]);
          } else {
            perimeter += 1;
          }
        }
        grid[tempI][tempJ] = CHECKED;
      }
      sum += area * perimeter;
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
