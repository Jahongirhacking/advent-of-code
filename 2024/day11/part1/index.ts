import * as fs from "fs";
import * as path from "path";

const changeNumber = (num: number): number[] => {
  if (num === 0) return [1];
  const len = String(num).length;
  if (len % 2 === 0)
    return [
      Number(String(num).slice(0, len / 2)),
      Number(String(num).slice(len / 2)),
    ];
  return [num * 2024];
};

const solve = (input: string) => {
  let numbers = input.split(" ").map(Number);
  const numberOfBlink = 25;
  for (let i = 0; i < numberOfBlink; i += 1) {
    const temp = [];
    for (let num of numbers) {
      temp.push(...changeNumber(num));
    }
    numbers = [...temp];
  }
  return numbers.length;
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
