import * as fs from "fs";
import * as path from "path";

type Rule = [number, number];

const isCorrectlyOrdered = (pageOrders: number[], rules: Rule[]): boolean => {
  const positionMap = new Map<number, number>();
  pageOrders.forEach((page, index) => positionMap.set(page, index));
  for (const [x, y] of rules) {
    if (positionMap.get(x)! > positionMap.get(y)!) {
      return false;
    }
  }
  return true;
};

const solve = (input: string) => {
  const [rules, pageOrders] = input.split("\n\n");
  const rulesArr = rules
    .split("\n")
    .map((el) => el.split("|").map(Number)) as Rule[];
  const pageOrdersArr = pageOrders
    .split("\n")
    .map((el) => el.split(",").map(Number));

  let sum = 0;
  for (const order of pageOrdersArr) {
    if (isCorrectlyOrdered(order, rulesArr)) continue;
    while (!isCorrectlyOrdered(order, rulesArr)) {
      for (let i = 0; i < order.length - 1; i += 1) {
        for (let j = i + 1; j < order.length; j += 1) {
          if (!rulesArr.find((r) => r[0] === order[i] && r[1] === order[j])) {
            const temp = order[i];
            order[i] = order[j];
            order[j] = temp;
          }
        }
      }
    }
    sum += order[Math.floor(order.length / 2)];
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
