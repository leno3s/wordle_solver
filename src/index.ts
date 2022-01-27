import { WORDS } from "./constant/wordlist";
import * as readline from "readline";

const main = async () => {
  console.log("start");
  const iterationCount = 6;
  const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const checker = new Checker();
  for (let i = 0; i < iterationCount; i++) {
    const word = await getLine(io, `word${i} > `);
    const status = await getLine(io, "status> ");
    const result = new Result(word, status);
    checker.check(result);
    const words = checker.getWords();
    console.log("Remain words: " + words.length);
    console.log(words);
    if(words.length === 1) {
      console.log("Success!");
      process.exit(0);
    }
    if(words.length === 0) {
      console.log("Failed.")
      process.exit(0);
    }
  }
};

async function getLine(io: readline.Interface, question: string) {
  return new Promise<string>((resolve, reject) => {
    io.question(question, (answer) => {
      resolve(answer);
    });
  });
}

class Checker {
  private wordList: string[];
  private matchedChars: Pair[] = [];
  private usedChars: Pair[] = [];
  private notUsedChars: string[] = [];

  constructor() {
    this.wordList = Array.from(WORDS);
  }

  check(result: Result) {
    for (let i = 0; i < 5; i++) {
      if (result.status[i] === "2") {
        this.matchedChars.push(new Pair(result.word[i], i));
      }
      if (result.status[i] === "1") {
        this.usedChars.push(new Pair(result.word[i], i));
      }
      if (result.status[i] === "0") {
        if (
          !(
            this.matchedChars.some((pair) => pair.char === result.word[i]) ||
            this.usedChars.some((pair) => pair.char === result.word[i])
          )
        ) {
          this.notUsedChars.push(result.word[i]);
        }
      }
    }
    this.wordList = this.wordList.filter((word) => {
      if (this.matchedChars.some((pair) => word[pair.index] !== pair.char)) {
        return false;
      }
      if (
        this.usedChars.some((pair) => word[pair.index] !== pair.char) &&
        !this.usedChars.some((pair) => word.includes(pair.char))
      ) {
        return false;
      }
      if (this.notUsedChars.some((char) => word.includes(char))) {
        return false;
      }
      return true;
    });
  }

  getWords() {
    return Array.from(this.wordList);
  }
}

class Pair {
  char: string;
  index: number;
  constructor(char: string, index: number) {
    this.char = char;
    this.index = index;
  }
}

class Result {
  constructor(word: string, status: string) {
    this.word = word;
    this.status = status;
  }
  word: string;
  status: string;
}

main();
