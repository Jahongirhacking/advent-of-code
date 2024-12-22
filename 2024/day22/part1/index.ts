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
  let sum = 0;
  for (let num of nums) {
    for (let i = 0; i < LIMIT; i += 1) {
      num = getNextSecret(num);
    }
    sum += num;
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
