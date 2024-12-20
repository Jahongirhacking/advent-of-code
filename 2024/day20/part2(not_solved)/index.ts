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

  runTillDie = (): { steps: number; collisions: string[] } => {
    interface IQueueElement {
      x: number;
      y: number;
      steps: number;
      collisions: Set<string>;
    }
    let visitedCollisions: Set<string> = new Set();
    const queue: IQueueElement[] = [
      { ...this.position, steps: 0, collisions: visitedCollisions },
    ];
    let minSteps = Infinity;
    while (queue.length) {
      const { x, y, steps, collisions } = queue.shift() as IQueueElement;
      // check end
      if (grid[x][y] === "E") {
        if (minSteps > steps) {
          visitedCollisions = new Set([
            Array.from(collisions).sort().join("-"),
          ]);
          minSteps = Math.min(minSteps, steps);
        } else if (minSteps === steps) {
          visitedCollisions.add(Array.from(collisions).sort().join("-"));
        }
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
      let newCollisions = new Set(Array.from(collisions));
      if (grid[x][y] === "@") newCollisions.add(encodeVisitedPosition(x, y));

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
          queue.push({
            x: nextX,
            y: nextY,
            steps: steps + 1,
            collisions: newCollisions,
          });
        }
      }
    }
    return {
      steps: minSteps,
      collisions: Array.from(visitedCollisions),
    };
  };
}

fs.writeFileSync(path.join(path.resolve(__dirname, ".."), "output.txt"), "");

const display = (...params: any[]) => {
  fs.appendFileSync(
    path.join(path.resolve(__dirname, ".."), "output.txt"),
    `${grid.map((line) => line.join("")).join("\n")}\n\n${params.join(
      ", "
    )}\n\n`
  );
};

const solve = (input: string) => {
  grid = input.split("\n").map((line) => line.split(""));
  const height = grid.length;
  const width = grid[0].length;
  let x: number, y: number, currentMoveIndex: number;
  let MIN_DIFF = 100;
  let COLLISION_INTERVAL = 20;

  // find robot position
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (grid[i][j] === "S") {
        [x, y] = [i, j];
      }
    }
  }

  const fillGrid = (
    x: number,
    y: number,
    steps: number,
    isReset: boolean = false
  ) => {
    interface IQueueElement {
      x: number;
      y: number;
      steps: number;
    }
    const queue: IQueueElement[] = [{ x, y, steps }];
    const visited: Set<string> = new Set();
    while (queue.length) {
      const {
        x: i,
        y: j,
        steps: remainingSteps,
      } = queue.shift() as IQueueElement;
      if (remainingSteps === 0) continue;
      if (visited.has(encodeVisitedPosition(i, j))) continue;
      if (grid[i][j] === "#" || grid[i][j] === "@") {
        grid[i][j] = isReset ? "#" : "@";
      }
      visited.add(encodeVisitedPosition(i, j));
      for (const move of moves) {
        const nextI = i + move[0],
          nextJ = j + move[1];
        if (
          nextI >= 0 &&
          nextI < grid.length &&
          nextJ >= 0 &&
          nextJ < grid[0].length
        ) {
          queue.push({ x: nextI, y: nextJ, steps: remainingSteps - 1 });
        }
      }
    }
  };

  // robot moves
  let count = 0;
  let robot = new Robot(x!, y!);
  const { steps: maxSteps } = robot.runTillDie();
  const visitedMap = robot.visited;
  const visitedCollisionPositions: Set<string> = new Set();
  for (let collision = 2; collision <= COLLISION_INTERVAL; collision += 1) {
    for (let i = 1; i < height - 1; i += 1) {
      for (let j = 1; j < width - 1; j += 1) {
        if (grid[i][j] !== "#") {
          robot = new Robot(i, j);
          // can move paths
          fillGrid(i, j, collision);
          // move
          const { steps, collisions } = robot.runTillDie();
          // display(
          //   collisions,
          //   maxSteps - (steps + visitedMap.get(encodeVisitedPosition(i, j))!),
          //   `size: ${visitedCollisionPositions.size}`
          // );
          for (const clsn of collisions) {
            if (!visitedCollisionPositions.has(clsn)) {
              visitedCollisionPositions.add(clsn);
              if (
                maxSteps -
                  (steps + visitedMap.get(encodeVisitedPosition(i, j))!) >=
                MIN_DIFF
              )
                count += 1;
            }
          }
          // reset
          fillGrid(i, j, collision, true);
        }
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
