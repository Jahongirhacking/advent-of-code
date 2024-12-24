import * as fs from "fs";
import * as path from "path";

type OperatorType = "XOR" | "OR" | "AND";
interface IQueue {
  args: string[];
  operator: OperatorType;
}

const extractArguments = (input: string): string[] => {
  const regex = /(\b\w+\b)\s+(?:AND|OR|XOR)\s+(\b\w+\b)\s+->\s+(\b\w+\b)/;
  const match = input.match(regex);
  return match ? match.slice(1, 4) : [];
};

const solve = (input: string) => {
  const [gates, expressions] = input.split("\n\n");
  const memo: Map<string, boolean> = new Map();
  gates.split("\n").forEach((g) => {
    const gate = g.split(": ");
    memo.set(gate[0], !!Number(gate[1]));
  });

  const expressionsQueue: IQueue[] = expressions.split("\n").map((el) => ({
    args: extractArguments(el),
    operator: el.split(" ")[1] as OperatorType,
  }));

  while (expressionsQueue.length) {
    const { args, operator } = expressionsQueue.shift() as IQueue;
    if (!memo.has(args[0]) || !memo.has(args[1])) {
      expressionsQueue.push({ args, operator });
      continue;
    }
    let res: boolean;
    switch (operator) {
      case "XOR": {
        res = memo.get(args[0])! !== memo.get(args[1])!;
        break;
      }
      case "OR": {
        res = memo.get(args[0])! || memo.get(args[1])!;
        break;
      }
      case "AND": {
        res = memo.get(args[0])! && memo.get(args[1])!;
        break;
      }
    }
    memo.set(args[2], res);
  }

  const result = [];
  for (const key of Array.from(memo.keys())) {
    if (key.startsWith("z")) {
      result[Number(key.match(/\d+/))] = Number(memo.get(key));
    }
  }
  return Number.parseInt([...result].reverse().join(""), 2);
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
