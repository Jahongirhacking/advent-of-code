import * as fs from "fs";
import * as path from "path";

class FileStack {
  fullSpace: number;
  files: number[] = [];

  constructor(file: number, numberOfBlocks: number, freeSpace: number) {
    for (let i = 0; i < numberOfBlocks; i += 1) this.files.push(file);
    this.fullSpace = numberOfBlocks + freeSpace;
  }

  addFile(filestack: FileStack) {
    if (this.fullSpace === this.files.length) return false;
    const file = filestack.takeFile();
    this.files.push(file as number);
  }

  takeFile() {
    const file = this.files.pop();
    return file;
  }

  isFull() {
    return this.files.length === this.fullSpace;
  }

  isEmpty() {
    return this.files.length === 0;
  }
}

function solve(input: string) {
  const arr = input.split("").map(Number);
  const fileStacks: FileStack[] = [];
  let sum = 0;
  for (let i = 0; i * 2 < arr.length; i += 1) {
    const numberOfBlocks = arr[i * 2] ?? 0;
    const freeSpace = arr[i * 2 + 1] ?? 0;
    fileStacks.push(new FileStack(i, numberOfBlocks, freeSpace));
  }
  // File operations
  for (let i = 0; i < fileStacks.length - 1; i += 1) {
    let j = fileStacks.length - 1;
    while (i < j) {
      if (fileStacks[i].isFull()) break;
      if (fileStacks[j].isEmpty()) {
        j -= 1;
        continue;
      }
      fileStacks[i].addFile(fileStacks[j]);
    }
  }
  // Flatten
  let res: number[] = [];
  for (let filestack of fileStacks) {
    res = [...res, ...filestack.files];
  }
  // Calculate
  for (let i = 0; i < res.length; i += 1) {
    sum += i * res[i];
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
