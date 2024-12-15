import * as fs from "fs";
import * as path from "path";

let grid: Movable[][] = [];

abstract class Movable {
  x: number;
  y: number;
  char: string;
  isMovable: boolean = true;
  constructor(x: number, y: number, char: string) {
    this.x = x;
    this.y = y;
    this.char = char;
  }
  move(dx: number, dy: number): boolean {
    const isMovable =
      this.isMovable && grid[this.x + dx][this.y + dy].move(dx, dy);
    if (isMovable) {
      swap(this.x, this.y, this.x + dx, this.y + dy);
    }
    return isMovable;
  }
}

class Robot extends Movable {}

class Box extends Movable {
  getGPSCoordinate() {
    return this.x * 100 + this.y;
  }
}

class Wall extends Movable {
  move(dx: number, dy: number): boolean {
    return false;
  }
}

class Ground extends Movable {
  move(dx: number, dy: number): boolean {
    return true;
  }
}

const swap = (x1: number, y1: number, x2: number, y2: number): void => {
  [grid[x1][y1], grid[x2][y2]] = [grid[x2][y2], grid[x1][y1]];
  grid[x1][y1].x = x1;
  grid[x1][y1].y = y1;
  grid[x2][y2].x = x2;
  grid[x2][y2].y = y2;
};

const display = (grid: Movable[][]) => {
  for (let i = 0; i < grid.length; i += 1) {
    let row = "";
    for (let j = 0; j < grid[0].length; j += 1) {
      row += grid[i][j].char;
    }
    console.log(row);
  }
  console.log();
};

const solve = (input: string) => {
  let [map, dir] = input.split("\n\n");
  let robot: Movable;
  // create elements
  map.split("\n").map((row, i) => {
    grid[i] = row.split("").map((element, j) => {
      if (element === "#") return new Wall(i, j, element);
      if (element === ".") return new Ground(i, j, element);
      if (element === "O") return new Box(i, j, element);
      else {
        robot = new Robot(i, j, element);
        return robot;
      }
    });
  });
  // create moves
  const directions = dir.split("\n").join("").split("");
  const moves = directions.map((d) => {
    if (d === ">") return [0, 1];
    if (d === "v") return [1, 0];
    if (d === "<") return [0, -1];
    else return [-1, 0];
  });
  // moves
  for (let [dx, dy] of moves) {
    robot!.move(dx, dy);
  }
  // calculations
  let sum = 0;
  for (let i = 0; i < grid.length; i += 1) {
    for (let j = 0; j < grid[0].length; j += 1) {
      if (grid[i][j].char === "O")
        sum += (grid[i][j] as Box).getGPSCoordinate();
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
