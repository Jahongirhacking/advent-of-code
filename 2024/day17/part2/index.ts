import * as fs from "fs";
import * as path from "path";

const getAnswer = (input: string, A: bigint) => {
  const [registers, program] = input.split("\n\n");
  const registerValues = registers
    .split("\n")
    .map((line) => BigInt(line.match(/\d+/g)![0]));
  const combo: (bigint | string | null)[] = [
    BigInt(0),
    BigInt(1),
    BigInt(2),
    BigInt(3),
    "A",
    "B",
    "C",
    null,
  ];
  const instructions = program
    .match(/\d+/g)!
    .map((instruction) => Number(instruction));

  registerValues[0] = A;

  const getComboValue = (index: bigint | number): bigint => {
    const value = combo[index as number];
    if (typeof value === "string") {
      return registerValues[(index as number) - 4];
    }
    return value === null ? BigInt(Infinity) : value;
  };

  // do instructions
  let flag = true;
  let initialIndex = 0;
  let result: bigint[] = [];

  const handleOperation = (opcode: number, operand: number) => {
    if (opcode === 0) {
      // adv -> A = A / 2**combo
      registerValues[0] =
        registerValues[0] / BigInt(Math.pow(2, Number(getComboValue(operand))));
    } else if (opcode === 1) {
      // bxl -> B = B xor literal
      registerValues[1] ^= BigInt(operand);
    } else if (opcode === 2) {
      // bst -> B = combo % 8
      registerValues[1] = getComboValue(operand) % BigInt(8);
    } else if (opcode === 3) {
      // jnz -> if(A=0) nothing else set pointer to literal; if jumps then pointer not increased by 2
      if (registerValues[0] === BigInt(0)) return;
      initialIndex = Number(operand);
      flag = true;
    } else if (opcode === 4) {
      // bxc -> B = B xor C
      registerValues[1] = registerValues[1] ^ registerValues[2];
    } else if (opcode === 5) {
      // out -> combo % 8
      result = [...result, getComboValue(operand) % BigInt(8)];
    } else if (opcode === 6) {
      // bdv -> B = A / 2**combo
      registerValues[1] =
        registerValues[0] / BigInt(Math.pow(2, Number(getComboValue(operand))));
    } else if (opcode === 7) {
      // cdv -> C = A / 2**combo
      registerValues[2] =
        registerValues[0] / BigInt(Math.pow(2, Number(getComboValue(operand))));
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

const solve = (input: string) => {
  const [_, program] = input.split("\n\n");
  const instructions = program
    .match(/\d+/g)!
    .map((instruction) => Number(instruction));

  let i = BigInt(1);
  while (true) {
    const answer = getAnswer(input, i);
    if (answer === instructions.join(",")) return i;
    if (instructions.join(",").endsWith(answer)) {
      i *= BigInt(8);
    } else {
      i += BigInt(1);
    }
  }
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
