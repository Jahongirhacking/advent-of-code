import * as fs from "fs";
import * as path from "path";

interface IPosition {
  x: number;
  y: number;
}

let grid: string[][] = [];

const encodeVisitedPosition = (...position: number[]) => {
  return position.join(":");
};

const decodeVisitedPosition = (encodedPosition: string) => {
  return encodedPosition.split(":").map(Number);
};

class Robot {
  position: IPosition;
  moves = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  currentMoveIndex: number;
  visited: Set<string> = new Set();
  isInLoop: boolean = false;

  constructor(x: number, y: number, currentMoveIndex: number) {
    this.position = { x, y };
    this.currentMoveIndex = currentMoveIndex;
    this.visited.add(encodeVisitedPosition(x, y, currentMoveIndex));
  }

  move = (): boolean => {
    const nextX = this.position.x + this.moves[this.currentMoveIndex][0];
    const nextY = this.position.y + this.moves[this.currentMoveIndex][1];
    // check if loop
    if (
      this.visited.has(
        encodeVisitedPosition(nextX, nextY, this.currentMoveIndex)
      )
    ) {
      this.isInLoop = true;
      return false;
    }
    // check border
    if (
      nextX < 0 ||
      nextX >= grid.length ||
      nextY < 0 ||
      nextY >= grid[0].length
    )
      return false;
    // move next
    if (grid[nextX][nextY] !== "#") {
      this.visited.add(
        encodeVisitedPosition(nextX, nextY, this.currentMoveIndex)
      );
      this.position = {
        x: nextX,
        y: nextY,
      };
      return true;
    }
    // change direction and move
    this.currentMoveIndex = (this.currentMoveIndex + 1) % this.moves.length;
    return this.move();
  };
}

const solve = (input: string) => {
  const robotStates = [">", "v", "<", "^"];
  grid = input.split("\n").map((line) => line.split(""));
  const height = grid.length;
  const width = grid[0].length;
  let x: number, y: number, currentMoveIndex: number;

  // find robot position
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (robotStates.includes(grid[i][j])) {
        [x, y, currentMoveIndex] = [i, j, robotStates.indexOf(grid[i][j])];
      }
    }
  }

  // robot moves
  let robot = new Robot(x!, y!, currentMoveIndex!);
  const visited: Set<string> = new Set();
  do {
    visited.add(encodeVisitedPosition(robot.position.x, robot.position.y));
  } while (robot.move());

  // add obstruction
  let count = 0;
  visited.forEach((position) => {
    const [i, j] = decodeVisitedPosition(position);
    if (grid[i][j] === ".") {
      robot = new Robot(x, y, currentMoveIndex);
      grid[i][j] = "#";
      while (robot.move()) {}
      if (robot.isInLoop) count += 1;
      grid[i][j] = ".";
    }
  });
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
