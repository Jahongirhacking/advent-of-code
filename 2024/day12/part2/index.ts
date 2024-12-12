import * as fs from "fs";
import * as path from "path";

class Plant {
  borders: [number, number][];
  name: string;
  isChecked: boolean;
  constructor(plantName: string) {
    this.name = plantName;
    this.isChecked = false;
    this.borders = [];
  }
  addBorder = (direction: [number, number]) => {
    if (!this.hasBorder(direction)) {
      this.borders.push(direction);
    }
  };
  hasBorder = (direction: [number, number]) => {
    return !!this.borders.find(
      (border) => border[0] === direction[0] && border[1] === direction[1]
    );
  };
  isSamePlant = (plant: Plant) => {
    return this.name === plant.name;
  };
  makeChecked = () => {
    this.isChecked = true;
  };
}

const solve = (input: string) => {
  const lines = input.split("\n");

  // create plants grid
  const plantsGrid: Plant[][] = [];
  for (const line of lines) {
    plantsGrid.push(line.split("").map((char) => new Plant(char)));
  }
  const height = plantsGrid.length;
  const width = plantsGrid[0].length;
  const moves = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let sum = 0;

  // Calculations
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      let area = 0,
        perimeter = 0;
      // BFS implementation
      const queue = [[i, j]];
      while (queue.length) {
        const [tempI, tempJ] = queue.shift() as [number, number];
        const plant: Plant = plantsGrid[tempI][tempJ];
        if (plant.isChecked) continue;
        area += 1;
        for (const [moveI, moveJ] of moves) {
          const nextI = tempI + moveI;
          const nextJ = tempJ + moveJ;
          if (
            nextI < height &&
            nextI >= 0 &&
            nextJ < width &&
            nextJ >= 0 &&
            plantsGrid[nextI][nextJ].isSamePlant(plant) &&
            !plantsGrid[nextI][nextJ].isChecked
          ) {
            queue.push([nextI, nextJ]);
          } else {
            const signs = [-1, 1];
            let isJoint =
              plantsGrid[nextI] &&
              plantsGrid[nextI][nextJ]?.isSamePlant(plant) &&
              plantsGrid[nextI][nextJ]?.isChecked;
            if (!isJoint) plant.addBorder([moveI, moveJ]);
            // add perimeter
            if (
              !isJoint &&
              !signs.some(
                (sign) =>
                  plantsGrid[tempI + sign * moveJ] &&
                  plantsGrid[tempI + sign * moveJ][
                    tempJ - sign * moveI
                  ]?.isSamePlant(plant) &&
                  plantsGrid[tempI + sign * moveJ][tempJ - sign * moveI]
                    ?.isChecked &&
                  plantsGrid[tempI + sign * moveJ][
                    tempJ - sign * moveI
                  ]?.hasBorder([moveI, moveJ])
              )
            ) {
              perimeter += 1;
            }
          }
        }
        plantsGrid[tempI][tempJ].makeChecked();
      }
      sum += area * perimeter;
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
