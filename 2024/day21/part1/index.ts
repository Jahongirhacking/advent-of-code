import * as fs from "fs";
import * as path from "path";

const moves: [number, number][] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const getMoveChar = (move: [number, number]) => {
  return [">", "v", "<", "^"][
    moves.findIndex((el) => el[0] === move[0] && el[1] === move[1])
  ];
};

const robotControlPosition = {
  "^": [0, 1],
  A: [0, 2],
  "<": [1, 0],
  v: [1, 1],
  ">": [1, 2],
};

const getMainPathShortcut = (grid: string[][], targets: string[]): string[] => {
  const height = grid.length;
  const width = grid[0].length;
  let x: number, y: number;
  // find robot position
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (grid[i][j] === "A") [x, y] = [i, j];
    }
  }
  // result
  const res: string[] = [];

  for (const target of targets) {
    let minIndex = 0;
    // BFS implementation
    type QueueType = [number, number, string[], string];
    const queue: QueueType[] = [[x!, y!, [], ""]];
    while (queue.length) {
      // moveArr = ['<', '^] => movesState = ['>>^', '<^']
      let [i, j, moveArr, movesState] = queue.shift() as QueueType;
      let index = movesState.split("A").length - 1;
      // compare with target
      while (grid[i][j] === target[index]) {
        movesState += `${moveArr.join("")}A`;
        index += 1;
        minIndex = Math.max(minIndex, index);
        moveArr = [];
        if (index === target.length) {
          res.push(movesState);
          break;
        }
      }
      // check min moves
      if (index >= target.length || index < minIndex) continue;
      // check moves
      for (const move of moves) {
        const nextI = i + move[0];
        const nextJ = j + move[1];
        if (
          nextI >= 0 &&
          nextI < grid.length &&
          nextJ >= 0 &&
          nextJ < grid[0].length &&
          grid[nextI][nextJ] !== " "
        ) {
          queue.push([
            nextI,
            nextJ,
            [...moveArr, getMoveChar(move)],
            movesState,
          ]);
        }
      }
    }
  }
  const minLength = [...res].sort((a, b) => a.length - b.length)[0].length;
  const arr = res.filter((el) => el.length == minLength);
  let minDiff = Infinity;
  let result: string[] = [];
  // check difference
  for (const element of arr) {
    const modifiedElement = `A${element}`;
    let dif = 0;
    for (let i = 0; i < modifiedElement.length - 1; i += 1) {
      const [pos1, pos2] = [
        robotControlPosition[modifiedElement[i] as ">" | "v" | "<" | "^"],
        robotControlPosition[modifiedElement[i + 1] as ">" | "v" | "<" | "^"],
      ];
      dif += Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
    }
    if (dif < minDiff) {
      minDiff = dif;
      result = [element];
    } else if (dif === minDiff) {
      result = [...result, element];
    }
  }
  return result;
};

function solve(input: string) {
  const mainGrid: string[][] = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [" ", "0", "A"],
  ];
  const robotGrid: string[][] = [
    [" ", "^", "A"],
    ["<", "v", ">"],
  ];

  const lines = input.split("\n");
  let sum = 0;
  for (const line of lines) {
    const shortcuts = getMainPathShortcut(
      robotGrid,
      getMainPathShortcut(robotGrid, getMainPathShortcut(mainGrid, [line]))
    );
    const num = Number(line.match(/\d+/)![0]);
    sum += shortcuts[0].length * num;
    console.log(shortcuts[0], shortcuts[0].length, num);
  }
  return sum;
}

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
