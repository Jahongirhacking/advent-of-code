import * as fs from "fs";
import * as path from "path";

interface IPosition {
  x: number;
  y: number;
}

let grid: string[][] = [];

const moves = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const encodeVisitedPosition = (...position: number[]) => {
  return position.join(":");
};

class Robot {
  position: IPosition;
  visited: Map<string, number> = new Map();

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  runTillDie = (): number => {
    interface IQueueElement {
      x: number;
      y: number;
      steps: number;
    }
    const queue: IQueueElement[] = [{ ...this.position, steps: 0 }];
    let minSteps = Infinity;
    while (queue.length) {
      const { x, y, steps } = queue.shift() as IQueueElement;
      // check end
      if (grid[x][y] === "E") {
        minSteps = Math.min(minSteps, steps);
        continue;
      }
      // check visited
      if (
        this.visited.has(encodeVisitedPosition(x, y)) &&
        this.visited.get(encodeVisitedPosition(x, y))! <= steps
      )
        continue;
      // visit
      this.visited.set(encodeVisitedPosition(x, y), steps);

      for (const move of moves) {
        const nextX = x + move[0];
        const nextY = y + move[1];
        // check boundary
        if (
          nextX >= 0 &&
          nextX < grid.length &&
          nextY >= 0 &&
          nextY < grid[0].length &&
          grid[nextX][nextY] !== "#"
        ) {
          queue.push({ x: nextX, y: nextY, steps: steps + 1 });
        }
      }
    }
    return minSteps;
  };
}

const solve = (input: string) => {
  grid = input.split("\n").map((line) => line.split(""));
  const height = grid.length;
  const width = grid[0].length;
  let x: number, y: number, currentMoveIndex: number;
  let MIN_DIFF = 100;

  // find robot position
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (grid[i][j] === "S") {
        [x, y] = [i, j];
      }
    }
  }

  // robot moves
  let count = 0;
  let robot = new Robot(x!, y!);
  const maxSteps = robot.runTillDie();
  for (let i = 1; i < height - 1; i += 1) {
    for (let j = 1; j < width - 1; j += 1) {
      if (grid[i][j] === "#") {
        robot = new Robot(x!, y!);
        grid[i][j] = ".";
        const steps = robot.runTillDie();
        grid[i][j] = "#";
        if (maxSteps - steps >= MIN_DIFF) count += 1;
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
