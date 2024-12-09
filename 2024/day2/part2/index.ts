import * as fs from "fs";
import * as path from "path";

const isSafe = (arr: number[]) => {
  let isInc = true,
    isDec = true;
  for (let i = 0; i < arr.length - 1; i += 1) {
    const dif = Math.abs(arr[i] - arr[i + 1]);
    if (dif > 3 || dif === 0) return false;
    isInc = isInc && arr[i] < arr[i + 1];
    isDec = isDec && arr[i] > arr[i + 1];
  }
  return isInc || isDec;
};

function solve(input: string) {
  const lines = input.split("\n");
  let count = 0;
  for (const line of lines) {
    const arr = line.split(" ").map(Number);
    for (let i = -1; i < arr.length; i += 1) {
      if (isSafe([...arr.slice(0, i), ...arr.slice(i + 1)])) {
        count += 1;
        break;
      }
    }
  }
  return count;
}

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
