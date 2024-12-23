import * as fs from "fs";
import * as path from "path";

class Computer {
  name: string;
  checked: boolean = false;
  connections: Computer[] = [];
  constructor(name: string) {
    this.name = name;
  }
  addConnection(computer: Computer) {
    this.connections.push(computer);
    computer.connections.push(this);
  }
}

const solve = (input: string) => {
  const memo: Map<string, Computer> = new Map();
  const networks = input.split("\n").map((el) =>
    el.split("-").map((comp) => {
      if (!memo.has(comp)) {
        memo.set(comp, new Computer(comp));
      }
      return memo.get(comp);
    })
  );
  // add connections
  for (const network of networks) {
    network[0]!.addConnection(network[1]!);
  }
  // calculations
  const set: Set<string> = new Set();
  for (const computer of Array.from(memo.values())) {
    // BFS implementation
    type QueueType = [Computer, number, string[]];
    const queue: QueueType[] = [[computer, 1, [computer.name]]];
    while (queue.length) {
      const [temp, level, list] = queue.shift() as QueueType;
      if (level >= 3) {
        if (temp.connections.find((con) => con.name === list[0])) {
          set.add([...list].sort().join(","));
        }
        continue;
      }
      for (const connection of temp.connections) {
        queue.push([connection, level + 1, [...list, connection.name]]);
      }
    }
  }
  // count
  let count = 0;
  for (const connection of Array.from(set.values())) {
    count += Number(
      connection
        .split(",")
        .reduce((acc, curr) => acc || curr.startsWith("t"), false)
    );
  }
  return count;
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
