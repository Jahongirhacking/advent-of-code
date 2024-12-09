import * as fs from "fs";
import * as path from "path";

type IFile = number | undefined;

class FileStack {
  value: number;
  numberOfOriginalBlocks: number;
  fullSpace: number;
  freeSpace: number;
  files: IFile[] = [];
  index: number;

  constructor(file: number, numberOfBlocks: number, freeSpace: number) {
    this.fullSpace = numberOfBlocks + freeSpace;
    this.files = Array.from({ length: this.fullSpace }).fill(
      undefined
    ) as IFile[];
    for (let i = 0; i < numberOfBlocks; i += 1) this.files[i] = file;
    this.value = file;
    this.freeSpace = freeSpace;
    this.numberOfOriginalBlocks = numberOfBlocks;
    this.index = numberOfBlocks;
  }

  addFile(filestack: FileStack) {
    if (this.freeSpace === 0) return false;
    const file: IFile = filestack.takeFile();
    this.files[this.index] = file;
    this.index += 1;
    this.freeSpace -= 1;
  }

  takeFile() {
    const index = this.files.indexOf(this.value);
    const file = this.files[index];
    this.files[index] = undefined;
    this.freeSpace += 1;
    return file;
  }
  isFull() {
    return this.freeSpace === 0;
  }
  isEmpty() {
    return this.freeSpace === this.fullSpace;
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
  for (let j = fileStacks.length - 1, i = 0; i < j; j -= 1) {
    for (; i < j; i += 1) {
      if (fileStacks[j].isEmpty()) break;
      if (
        fileStacks[i].isFull() ||
        fileStacks[i].freeSpace < fileStacks[j].numberOfOriginalBlocks
      )
        continue;
      for (let k = 0; k < fileStacks[j].numberOfOriginalBlocks; k += 1) {
        fileStacks[i].addFile(fileStacks[j]);
      }
      break;
    }
    i = 0;
  }
  // Flatten
  let res: IFile[] = [];
  for (let filestack of fileStacks) {
    res = [...res, ...filestack.files];
  }
  // Calculate
  for (let i = 0; i < res.length; i += 1) {
    sum += i * (res[i] ?? 0);
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
