import * as fs from "fs";
import * as path from "path";

interface IPosition {
  x: number;
  y: number;
}

class Robot {
  position: IPosition;
  velocity: IPosition;
  gridHeight: number;
  gridWidth: number;
  constructor(
    x: number,
    y: number,
    dx: number,
    dy: number,
    height: number,
    width: number
  ) {
    this.position = { x, y };
    this.velocity = { x: dx, y: dy };
    this.gridHeight = height;
    this.gridWidth = width;
  }

  move() {
    const x1 =
      ((this.position.x % this.gridWidth) +
        (this.velocity.x % this.gridWidth)) %
      this.gridWidth;
    const y1 =
      ((this.position.y % this.gridHeight) +
        (this.velocity.y % this.gridHeight)) %
      this.gridHeight;
    this.position = {
      x: x1 < 0 ? this.gridWidth + x1 : x1,
      y: y1 < 0 ? this.gridHeight + y1 : y1,
    };
  }
}

const solve = (input: string) => {
  const lines = input.split("\n");
  const HEIGHT = 103;
  const WIDTH = 101;
  const SECONDS = 7133;
  const TARGET = 7132;
  const robots: Robot[] = [];
  // create robots
  for (const line of lines) {
    const [x, y, dx, dy] = line.match(/-?\d+/g)!.map(Number);
    robots.push(new Robot(x, y, dx, dy, HEIGHT, WIDTH));
  }
  // Clear the output file before writing
  fs.writeFileSync(path.join(path.resolve(__dirname, ".."), "output.txt"), "");
  // moves
  for (let i = 0; i < SECONDS; i += 1) {
    if (i === TARGET) {
      fs.appendFileSync(
        path.join(path.resolve(__dirname, ".."), "output.txt"),
        `\nSecond: ${i}\n\n`
      );
    }
    for (let h = 0; h < HEIGHT; h += 1) {
      let str = "";
      for (let w = 0; w < WIDTH; w += 1) {
        let flag = false;
        for (const robot of robots) {
          if (robot.position.x === w && robot.position.y === h) {
            flag = true;
            str += "O";
            break;
          }
        }
        if (!flag) str += ".";
      }
      // Append the grid line to the file
      if (i === TARGET) {
        fs.appendFileSync(
          path.join(path.resolve(__dirname, ".."), "output.txt"),
          str + "\n"
        );
      }
    }
    for (const robot of robots) robot.move();
  }
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
