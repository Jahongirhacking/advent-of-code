import * as fs from "fs";
import * as path from "path";

const prune = (val: number) => {
  const mod = 16777216;
  let res = val % mod;
  if (res < 0) {
    res += mod;
  }
  return res;
};

const getNextSecret = (secret: number) => {
  let newSecret = prune(secret ^ (secret * 64));
  newSecret = prune(newSecret ^ Math.floor(newSecret / 32));
  newSecret = prune(newSecret ^ (newSecret * 2048));
  return newSecret;
};

function solve(input: string) {
  const LIMIT = 2000;
  const nums = input.split("\n").map(Number);
  const memo: Map<string, number> = new Map();

  for (let num of nums) {
    const innerMemo: Map<string, number> = new Map();
    const slidingWindow = []; // only 4 items
    for (let i = 0; i < LIMIT; i += 1) {
      const val = getNextSecret(num);
      slidingWindow.push((val % 10) - (num % 10));
      if (slidingWindow.length === 4) {
        // find maximum
        if (!innerMemo.has(slidingWindow.join(","))) {
          innerMemo.set(slidingWindow.join(","), val % 10);
        }
        slidingWindow.shift();
      }
      num = val;
    }
    // add to memo
    for (const key of Array.from(innerMemo.keys())) {
      if (memo.has(key)) {
        memo.set(key, memo.get(key)! + innerMemo.get(key)!);
      } else {
        memo.set(key, innerMemo.get(key)!);
      }
    }
  }
  let max = 0;
  for (const value of Array.from(memo.values())) max = Math.max(max, value);
  return max;
}

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
