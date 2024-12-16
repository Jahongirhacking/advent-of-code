import * as fs from "fs";
import * as path from "path";

const encodePosition = (i: number, j: number) => `${i}:${j}`;

const solve = (input: string) => {
  const grid = input.split("\n").map((row) => row.split(""));
  const height = grid.length;
  const width = grid[0].length;
  const visited = new Map();
  const moves = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const isMovable = (grid: string[][], i: number, j: number) => {
    return i < height && i >= 0 && j < width && j >= 0 && grid[i][j] !== "#";
  };

  const isVisited = (i: number, j: number) => {
    return visited.has(encodePosition(i, j));
  };

  const makeVisited = (
    grid: string[][],
    i: number,
    j: number,
    moveIndex: number,
    score: number
  ) => {
    const arr = [">", "v", "<", "^"];
    grid[i][j] = arr[moveIndex];
    visited.set(encodePosition(i, j), score);
  };

  // find reinder
  type QueueElementType = [number, number, number, number];
  const queue: QueueElementType[] = [];
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (grid[i][j] === "S") queue.push([i, j, 0, 0]);
    }
  }
  // calculations BFS
  let min = Infinity;
  while (queue.length) {
    const [i, j, score, moveIndex] = queue.shift() as QueueElementType;
    // If it's on the finish line
    if (grid[i][j] === "E") {
      min = Math.min(min, score);
      continue;
    }
    // if already visited and min score
    if (isVisited(i, j) && visited.get(encodePosition(i, j)) <= score) {
      continue;
    }
    makeVisited(grid, i, j, moveIndex, score);
    // legal moves
    const moveArr = [0, 1, 2, 3]
      .filter((num) =>
        isMovable(
          grid,
          i + moves[(moveIndex + num) % moves.length][0],
          j + moves[(moveIndex + num) % moves.length][1]
        )
      )
      .map((num) => ({
        num,
        score: num === 0 ? 1 : num === 1 || num === 3 ? 1001 : 2001,
      }));
    // add legal moves to queue
    for (const move of moveArr) {
      queue.push([
        i + moves[(moveIndex + move.num) % moves.length][0],
        j + moves[(moveIndex + move.num) % moves.length][1],
        score + move.score,
        (moveIndex + move.num) % moves.length,
      ]);
    }
  }
  return min;
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
