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

const getMainPathShortcut = (
  grid: string[][],
  targets: string[],
  robotChar: string
): string[] => {
  const height = grid.length;
  const width = grid[0].length;
  let x: number, y: number;
  // find robot position
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (grid[i][j] === robotChar) [x, y] = [i, j];
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
  const arr = res
    .filter((el) => el.length == minLength)
    .map((el) => el.slice(1));
  let minDiff = Infinity;
  let result: string[] = [];
  // check difference
  for (const element of arr) {
    let dif = 0;
    for (let i = 0; i < element.length - 1; i += 1) {
      const [pos1, pos2] = [
        robotControlPosition[element[i] as ">" | "v" | "<" | "^"],
        robotControlPosition[element[i + 1] as ">" | "v" | "<" | "^"],
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
  const combinationsMain = [
    "A",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  const combinationsRobot = ["A", ">", "^", "v", "<"];
  const lines = input.split("\n");
  const LIMIT = 26;

  /**
   * CACHING BEGIN
   * */
  const encodeTransition = (i: string, j: string) => `${i}->${j}`;
  // create cache for main path
  const mainMap: Map<string, string[]> = new Map();
  for (const i of combinationsMain) {
    for (const j of combinationsMain) {
      if (!mainMap.has(encodeTransition(i, j))) {
        mainMap.set(
          encodeTransition(i, j),
          getMainPathShortcut(mainGrid, [`${i}${j}`], i)
        );
      }
    }
  }
  // create cache for robot path
  const robotMap: Map<string, string[]> = new Map();
  for (const i of combinationsRobot) {
    for (const j of combinationsRobot) {
      if (!robotMap.has(encodeTransition(i, j))) {
        robotMap.set(
          encodeTransition(i, j),
          getMainPathShortcut(robotGrid, [`${i}${j}`], i)
        );
      }
    }
  }
  const memo: Map<string, number> = new Map();
  /**CACHING END */

  const calculate = (command: string, count: number = 0): number => {
    let sum = 0;
    if (count === LIMIT) return command.length;
    const element = `A${command}`;
    if (memo.has(`${element}:${count}`)) {
      return memo.get(`${element}:${count}`)!;
    }
    for (let i = 0; i < element.length - 1; i += 1) {
      sum += (count === 0 ? mainMap : robotMap)
        .get(encodeTransition(element[i], element[i + 1]))!
        .reduce(
          (acc, curr) => Math.min(acc, calculate(curr, count + 1)),
          Infinity
        );
    }
    memo.set(`${element}:${count}`, sum);
    return sum;
  };

  // calculations
  let sum = 0;
  for (let line of lines) {
    sum += calculate(line) * Number(line.match(/\d+/)![0]);
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
