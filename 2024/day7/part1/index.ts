import * as fs from "fs";
import * as path from "path";

function solve(input: string) {
  function canProduceTarget(target: number, numbers: number[]): boolean {
    const operators = ["+", "*"];

    function evaluate(numbers: number[], ops: string[]): number {
      let result = numbers[0];
      for (let i = 0; i < ops.length; i++) {
        if (ops[i] === "+") {
          result += numbers[i + 1];
        } else if (ops[i] === "*") {
          result *= numbers[i + 1];
        }
      }
      return result;
    }

    function generateOperators(positions: number): string[][] {
      if (positions === 0) return [[]];
      const subOperators = generateOperators(positions - 1);
      return operators.flatMap((op) => subOperators.map((sub) => [op, ...sub]));
    }

    const operatorCombinations = generateOperators(numbers.length - 1);
    return operatorCombinations.some(
      (ops) => evaluate(numbers, ops) === target
    );
  }

  let total = 0;

  for (const equation of input.split("\n")) {
    const [targetStr, numbersStr] = equation.split(":");
    const target = parseInt(targetStr.trim(), 10);
    const numbers = numbersStr.trim().split(" ").map(Number);

    if (canProduceTarget(target, numbers)) {
      total += target;
    }
  }

  return total;
}

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
