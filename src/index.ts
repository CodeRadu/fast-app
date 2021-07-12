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
  color: string;
  function: string;
  arguments: Array<string>;
}

const APPS: Array<app> = [
  {
    index: 0,
    name: "React",
    color: "\x1b[34m",
    function: "npx",
    arguments: ["create-react-app"],
  },
  {
    index: 1,
    name: "Next.js",
    color: "\x1b[36m",
    function: "npx",
    arguments: ["create-next-app"],
  },
  {
    index: 2,
    name: "Svelte",
    color: "\x1b[31m",
    function: "npx",
    arguments: ["degit", "sveltejs/template"],
  },
  {
    index: 3,
    name: "Express JS",
    color: "\x1b[33m",
    function: "npx",
    arguments: ["degit", "coderadu/fast-app-expressjs"],
  },
  {
    index: 4,
    name: "Express TS",
    color: "\x1b[34m",
    function: "npx",
    arguments: ["degit", "coderadu/fast-app-expressts"],
  },
];

const args: Array<string> = process.argv;

async function main(path: string = ".") {
  console.log("<--Fast App-->".bold);
  console.log(snippets.separator);
  console.log(`Choose app type ${path != "." ? `to create in ${path}` : ""}`);
  listApps(APPS);
  const selected = await getInput(readlineInterface);
  const found = APPS.find(
    (app) => app.index.toString() === (selected as string)
  );
  if (!found) {
    console.error("Error: Input invalid");
    process.exit(1);
  }
  console.log(`Creating ${found.name} app in ${path}`);
  console.time("Create");
  const cmd = spawn(found.function, [...found.arguments, path]);
  cmd.stdout.pipe(process.stdout);
  cmd.on("exit", (code: number) => {
    if (code != 0) {
      console.log("Failed");
    }
    console.timeEnd("Create");
    process.exit(code);
  });
}
main(args[2]);

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
