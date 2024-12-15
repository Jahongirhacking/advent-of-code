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
  getIsMovable(dx: number, dy: number): boolean {
    return (
      this.isMovable && grid[this.x + dx][this.y + dy].getIsMovable(dx, dy)
    );
  }
  move(dx: number, dy: number): void {
    grid[this.x + dx][this.y + dy].move(dx, dy);
    swap(this.x, this.y, this.x + dx, this.y + dy);
  }
}

class Robot extends Movable {}

class Box extends Movable {
  getGPSCoordinate() {
    return this.x * 100 + this.y;
  }
  getIsMovable(dx: number, dy: number): boolean {
    if (dx === 0) {
      return super.getIsMovable(dx, dy);
    } else {
      const sign = this.char === "[" ? 1 : -1;
      return (
        this.isMovable &&
        grid[this.x + dx][this.y + dy].char !== "#" &&
        grid[this.x + dx][this.y + sign + dy].char !== "#" &&
        grid[this.x + dx][this.y + dy].getIsMovable(dx, dy) &&
        grid[this.x + dx][this.y + sign + dy].getIsMovable(dx, dy)
      );
    }
  }
  move(dx: number, dy: number): void {
    if (dx === 0) {
      if (super.getIsMovable(dx, dy)) super.move(dx, dy);
    } else {
      if (this.getIsMovable(dx, dy)) {
        grid[this.x + dx][this.y + dy].move(dx, dy);
        const sign = this.char === "[" ? 1 : -1;
        grid[this.x + dx][this.y + sign + dy].move(dx, dy);
        swap(this.x, this.y + sign, this.x + dx, this.y + sign + dy);
        swap(this.x, this.y, this.x + dx, this.y + dy);
      }
    }
  }
}

class Wall extends Movable {
  getIsMovable(dx: number, dy: number): boolean {
    return false;
  }
}

class Ground extends Movable {
  getIsMovable(dx: number, dy: number): boolean {
    return true;
  }
  move(dx: number, dy: number): void {
    return;
  }
}

const swap = (x1: number, y1: number, x2: number, y2: number): void => {
  [grid[x1][y1], grid[x2][y2]] = [grid[x2][y2], grid[x1][y1]];
  grid[x1][y1].x = x1;
  grid[x1][y1].y = y1;
  grid[x2][y2].x = x2;
  grid[x2][y2].y = y2;
};

// Clear the output.txt file before starting
fs.writeFileSync(path.join(path.resolve(__dirname, ".."), "output.txt"), "");

const display = (grid: Movable[][]) => {
  let output = "";
  for (let i = 0; i < grid.length; i += 1) {
    let row = "";
    for (let j = 0; j < grid[0].length; j += 1) {
      row += grid[i][j].char;
    }
    output += row + "\n";
  }
  output += "\n";

  // Append the grid display to output.txt
  fs.appendFileSync(
    path.join(path.resolve(__dirname, ".."), "output.txt"),
    output
  );
};

const solve = (input: string) => {
  let [map, dir] = input.split("\n\n");
  let robot: Movable;
  // create elements
  map.split("\n").map((row, i) => {
    let newRow = "";
    for (const char of row.split("")) {
      if (char === "#") newRow += "##";
      else if (char === "O") newRow += "[]";
      else if (char === ".") newRow += "..";
      else if (char === "@") newRow += "@.";
    }
    grid[i] = newRow.split("").map((element, j) => {
      if (element === "#") return new Wall(i, j, element);
      if (element === ".") return new Ground(i, j, element);
      if (element === "[" || element === "]") return new Box(i, j, element);
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
    display(grid);
    if (robot!.getIsMovable(dx, dy)) {
      robot!.move(dx, dy);
    }
  }
  // calculations
  let sum = 0;
  for (let i = 0; i < grid.length; i += 1) {
    for (let j = 0; j < grid[0].length; j += 1) {
      if (grid[i][j].char === "[") {
        sum += (grid[i][j] as Box).getGPSCoordinate();
      }
    }
  }
  display(grid);
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
