import * as fs from "fs";
import * as path from "path";

function generatePairs(
  arr: [number, number][]
): [[number, number], [number, number]][] {
  const pairs: [[number, number], [number, number]][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}

function solve(input: string) {
  const lines = input.split("\n");
  const grid: string[][] = [];
  for (const line of lines) {
    grid.push(line.split(""));
  }
  const height = grid.length;
  const width = grid[0].length;
  const res: [number, number][] = [];
  const map = new Map<string, [number, number][]>();

  // get locations
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      const char = grid[i][j];
      if (char === ".") continue;
      if (map.has(char)) {
        map.set(char, [...(map.get(char) ?? []), [i, j]]);
      } else {
        map.set(char, [[i, j]]);
      }
    }
  }

  const checkAntinodePos = (pos: [number, number]) => {
    const [iPos, jPos] = pos;
    return (
      iPos < height &&
      iPos >= 0 &&
      jPos < width &&
      jPos >= 0 &&
      !res.find((r) => r[0] === iPos && r[1] === jPos)
    );
  };

  // calculate
  for (let locations of Array.from(map.values())) {
    const combinations = generatePairs(locations);
    for (let comb of combinations) {
      const iMove = comb[1][0] - comb[0][0];
      const jMove = comb[1][1] - comb[0][1];
      // new antinode
      const antinode1: [number, number][] = [];
      // diagonal up
      for (let cnt = 0; ; cnt += 1) {
        const iNext = comb[0][0] - iMove * cnt;
        const jNext = comb[0][1] - jMove * cnt;
        if (iNext < height && iNext >= 0 && jNext < width && jNext >= 0) {
          if (checkAntinodePos([iNext, jNext])) res.push([iNext, jNext]);
        } else break;
      }
      // diagonal down
      for (let cnt = 0; ; cnt += 1) {
        const iNext = comb[1][0] + iMove * cnt;
        const jNext = comb[1][1] + jMove * cnt;
        if (iNext < height && iNext >= 0 && jNext < width && jNext >= 0) {
          if (checkAntinodePos([iNext, jNext])) res.push([iNext, jNext]);
        } else break;
      }
    }
  }
  return res.length;
}

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
