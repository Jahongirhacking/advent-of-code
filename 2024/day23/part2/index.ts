import * as fs from "fs";
import * as path from "path";

class Computer {
  name: string;
  connections: Computer[] = [];
  constructor(name: string) {
    this.name = name;
  }
  addConnection(computer: Computer) {
    this.connections.push(computer);
    computer.connections.push(this);
  }
}

const union = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  return new Set([...Array.from(setA), ...Array.from(setB)]);
};

const intersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  return new Set(Array.from(setA).filter((element) => setB.has(element)));
};

const difference = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  return new Set(Array.from(setA).filter((element) => !setB.has(element)));
};

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
  // Bron-Kerbosch
  let maxClique: Set<Computer> = new Set();
  const getMaxClique = (
    current: Set<Computer>,
    candidates: Set<Computer>,
    excluded: Set<Computer>
  ) => {
    if (candidates.size === 0 && excluded.size === 0) return current;
    for (const candidate of Array.from(candidates)) {
      const clique = getMaxClique(
        union(new Set([candidate]), current),
        intersection(new Set(candidate.connections), candidates),
        intersection(new Set(candidate.connections), excluded)
      );
      if (clique && clique.size > maxClique.size) {
        maxClique = clique;
      }
      candidates = difference(candidates, new Set([candidate]));
      excluded = union(excluded, new Set([candidate]));
    }
  };
  // add connections
  for (const network of networks) {
    network[0]!.addConnection(network[1]!);
  }
  // calculations
  getMaxClique(new Set(), new Set(Array.from(memo.values())), new Set());
  return Array.from(maxClique)
    .map((el) => el.name)
    .sort()
    .join(",");
};

// Read the whole input file synchronously
const input = fs.readFileSync(
  path.join(path.resolve(__dirname, ".."), "input.txt"),
  "utf8"
);

// Pass the input to the solve function
const answer = solve(input);
console.log(answer);
