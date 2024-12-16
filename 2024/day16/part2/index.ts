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

  const isMovable = (i: number, j: number) => {
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

  const getMovableArray = (
    i: number,
    j: number,
    moveIndex: number
  ): { num: number; score: number }[] => {
    return [0, 1, 2, 3]
      .filter((num) =>
        isMovable(
          i + moves[(moveIndex + num) % moves.length][0],
          j + moves[(moveIndex + num) % moves.length][1]
        )
      )
      .map((num) => ({
        num,
        score: num === 0 ? 1 : num === 1 || num === 3 ? 1001 : 2001,
      }));
  };

  // find reinder
  type QueueElementType = [number, number, number, number, [number, number][]];
  const queue: QueueElementType[] = [];
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (grid[i][j] === "S") queue.push([i, j, 0, 0, []]);
    }
  }
  // calculations BFS
  let min = Infinity;
  let tiles: [number, number][] = [];
  while (queue.length) {
    const [i, j, score, moveIndex, tileIndexes] =
      queue.shift() as QueueElementType;
    // If it's on the finish line
    if (grid[i][j] === "E") {
      if (min > score) {
        min = score;
        tiles = [...tileIndexes];
      } else if (min === score) {
        for (const tile of tileIndexes) {
          if (tiles.find((t) => t[0] === tile[0] && t[1] === tile[1])) continue;
          tiles = [...tiles, tile];
        }
      }
      continue;
    }
    // movable direction indexes
    const moveArr = getMovableArray(i, j, moveIndex);
    if (isVisited(i, j) && visited.get(encodePosition(i, j)) < score) {
      // double check
      if (
        !moveArr.find((move) => {
          const nextI = i + moves[(moveIndex + move.num) % moves.length][0];
          const nextJ = j + moves[(moveIndex + move.num) % moves.length][1];
          return (
            !visited.has(encodePosition(nextI, nextJ)) ||
            visited.get(encodePosition(nextI, nextJ)) >= score + move.score
          );
        })
      ) {
        continue;
      }
    } else {
      makeVisited(grid, i, j, moveIndex, score);
    }
    // legal moves
    for (const move of moveArr) {
      queue.push([
        i + moves[(moveIndex + move.num) % moves.length][0],
        j + moves[(moveIndex + move.num) % moves.length][1],
        score + move.score,
        (moveIndex + move.num) % moves.length,
        [...tileIndexes, [i, j]],
      ]);
    }
  }
  return tiles.length + 1;
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
