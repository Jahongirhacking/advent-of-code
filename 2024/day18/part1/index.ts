import * as fs from "fs";
import * as path from "path";

const solve = (input: string) => {
  const arr = input.split("\n").map((line) => line.split(",").map(Number));
  const moves = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const visited: Map<string, number> = new Map();
  const numberOfFirstBytes = 1024;
  const GRID_SIZE = 71;
  const grid: string[][] = Array.from({ length: GRID_SIZE }).map(() =>
    Array.from({ length: GRID_SIZE }).map(() => ".")
  );

  const encodePosition = (i: number, j: number) => {
    return `${i}:${j}`;
  };

  const isVisited = (i: number, j: number) => {
    return visited.has(encodePosition(i, j));
  };

  const makeVisited = (i: number, j: number, steps: number) => {
    visited.set(encodePosition(i, j), steps);
  };

  // add obstacles
  for (let i = 0; i < numberOfFirstBytes; i += 1) {
    grid[arr[i][1]][arr[i][0]] = "#";
  }
  // bfs traverse
  type QueueType = [number, number, number];
  const queue: QueueType[] = [[0, 0, 0]];
  while (queue.length) {
    const [i, j, steps] = queue.shift() as QueueType;
    if (isVisited(i, j) && (visited.get(encodePosition(i, j)) ?? 0) <= steps)
      continue;
    makeVisited(i, j, steps);
    // moves
    for (const move of moves) {
      const nextI = i + move[0];
      const nextJ = j + move[1];
      if (
        nextI >= 0 &&
        nextI < GRID_SIZE &&
        nextJ >= 0 &&
        nextJ < GRID_SIZE &&
        grid[nextI][nextJ] !== "#"
      ) {
        queue.push([nextI, nextJ, steps + 1]);
      }
    }
  }
  return visited.get(encodePosition(GRID_SIZE - 1, GRID_SIZE - 1));
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
