#! /usr/bin/env node

import colors from "colors";
import snippets from "./consoleSnippets";
import readline from "readline";
import { spawn } from "child_process";

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

doNothing(colors); // Required for tsc to include colors in js

interface app {
  index: number;
  name: string;
  function: string;
  color: string;
  arguments: Array<string>;
}

const APPS: Array<app> = [
  {
    name: "React",
    function: "npx",
    color: "\x1b[34m",
    index: 0,
    arguments: ["create-react-app", "."],
  },
  {
    name: "Next.js",
    function: "npx",
    color: "\x1b[36m",
    index: 1,
    arguments: ["create-next-app", "."],
  },
  {
    name: "Svelte",
    function: "npx",
    color: "\x1b[31m",
    index: 2,
    arguments: ["degit", "sveltejs/template", "."],
  },
];

async function main() {
  console.log("<--Fast App-->".bold);
  console.log(snippets.separator);
  console.log("Choose app type");
  listApps(APPS);
  const selected = await getInput(readlineInterface);
  const found = APPS.find(
    (app) => app.index.toString() === (selected as string)
  );
  if (!found) {
    console.error("Error: Input invalid");
    process.exit(1);
  }
  const cmd = spawn(found.function, found.arguments);
  cmd.stdout.pipe(process.stdout);
  cmd.on("exit", (code: number) => {
    process.exit(code);
  });
}
main();

function listApps(apps: Array<app>) {
  let index = 0;
  const indexesArray: Array<number> = [];

  apps.forEach((app) => {
    console.log(app.color, ` ${index}: ${app.name}`);
    indexesArray.push(index);
    index++;
  });
  console.log("\x1b[37m");
  console.log("[", ...indexesArray, "]");
}

function getInput(int: readline.Interface) {
  return new Promise((resolve, reject) => {
    int.question("Enter your answer: ", (answer) => {
      resolve(answer);
      int.close();
    });
  });
}

function doNothing(variable: any) {}
