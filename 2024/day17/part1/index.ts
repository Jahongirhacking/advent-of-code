import * as fs from "fs";
import * as path from "path";

const solve = (input: string) => {
  const [registers, program] = input.split("\n\n");
  const registerValues = registers
    .split("\n")
    .map((line) => Number(line.match(/\d+/g)));
  const combo = [0, 1, 2, 3, "A", "B", "C", null];
  const instructions = program
    .match(/\d+/g)!
    .map((instruction) => Number(instruction));

  const getComboValue = (index: number): number => {
    const value = combo[index];
    if (typeof value === "string") {
      return registerValues[index - 4];
    }
    return value === null ? Infinity : value;
  };

  // do instructions
  let flag = true;
  let initialIndex = 0;
  let result: number[] = [];

  const handleOperation = (opcode: number, operand: number) => {
    if (opcode === 0) {
      // adv -> A = A / 2**combo
      registerValues[0] = Math.floor(
        registerValues[0] / Math.pow(2, getComboValue(operand))
      );
    } else if (opcode === 1) {
      // bxl -> B = B xor literal
      registerValues[1] = registerValues[1] ^ operand;
    } else if (opcode === 2) {
      // bst -> B = combo % 8
      registerValues[1] = getComboValue(operand) % 8;
    } else if (opcode === 3) {
      // jnz -> if(A=0) nothing else set pointer to literal; if jumps then pointer not increased by 2
      if (registerValues[0] === 0) return;
      initialIndex = operand;
      flag = true;
    } else if (opcode === 4) {
      // bxc -> B = B xor C
      registerValues[1] = registerValues[1] ^ registerValues[2];
    } else if (opcode === 5) {
      // out -> combo % 8
      result = [...result, getComboValue(operand) % 8];
    } else if (opcode === 6) {
      // bdv -> B = A / 2**combo
      registerValues[1] = Math.floor(
        registerValues[0] / Math.pow(2, getComboValue(operand))
      );
    } else if (opcode === 7) {
      // cdv -> C = A / 2**combo
      registerValues[2] = Math.floor(
        registerValues[0] / Math.pow(2, getComboValue(operand))
      );
    }
    return null;
  };

  while (flag) {
    flag = false;
    for (let i = initialIndex * 2; i < instructions.length; i += 2) {
      handleOperation(instructions[i], instructions[i + 1]);
    }
  }

  return result.join(",");
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
