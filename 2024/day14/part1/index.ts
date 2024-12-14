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
  const SECONDS = 100;
  const robots: Robot[] = [];
  // create robots
  for (const line of lines) {
    const [x, y, dx, dy] = line.match(/-?\d+/g)!.map(Number);
    robots.push(new Robot(x, y, dx, dy, HEIGHT, WIDTH));
  }
  // moves
  for (let i = 0; i < SECONDS; i += 1) {
    for (const robot of robots) robot.move();
  }
  // calculations
  const res = [0, 0, 0, 0];
  for (const robot of robots) {
    // top-left
    if (
      robot.position.x < Math.floor(WIDTH / 2) &&
      robot.position.y < Math.floor(HEIGHT / 2)
    )
      res[0] += 1;
    // top-right
    if (
      robot.position.x > Math.floor(WIDTH / 2) &&
      robot.position.y < Math.floor(HEIGHT / 2)
    )
      res[1] += 1;
    // bottom-left
    if (
      robot.position.x < Math.floor(WIDTH / 2) &&
      robot.position.y > Math.floor(HEIGHT / 2)
    )
      res[2] += 1;
    // bottom-right
    if (
      robot.position.x > Math.floor(WIDTH / 2) &&
      robot.position.y > Math.floor(HEIGHT / 2)
    )
      res[3] += 1;
  }
  return res.reduce((acc, curr) => acc * curr, 1);
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
