#! /usr/bin/env node

import colors from "colors";
import snippets from "./consoleSnippets";
import readline from "readline";
import { spawn } from "child_process";
import APPS, { App } from "./apps";

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

doNothing(colors); // Required for tsc to include colors in js

const args: Array<string> = process.argv;

function createApp(selected: unknown, path: string) {
  const found = APPS.find(
    (app) => app.index.toString() === (selected as string)
  );
  if (!found) {
    console.error("Error: Input invalid");
    process.exit(1);
  }
  console.log(`Creating ${found.name} app in ${path}`);
  console.time("Create");
  const installCmd=`npm i -g ${found.package}`;
  const install=spawn(installCmd, {shell:true});
  install.on('exit', (code: number)=>{
    if(code!=0){
      console.error(`Error: ${found.package} install failed`);
      process.exit(1);
    }
    console.log(`${found.package}: installed`);
    const cmd = spawn(found.function, [...found.arguments, path], {shell: true});
    cmd.stdout.pipe(process.stdout);
    cmd.on("exit", (code: number) => {
      if (code != 0) {
        console.log("Failed");
      }
      console.timeEnd("Create");
      process.exit(code);
    });
  })
}

async function main(path: string = ".") {
  console.log("<--Fast App-->".bold);
  console.log(snippets.separator);
  console.log(`Choose app type ${path != "." ? `to create in ${path}` : ""}`);
  listApps(APPS);
  const selected = await getInput(readlineInterface);
  createApp(selected, path);
}

function autoRun(path: string, type: string) {
  if (isNaN(+type)) {
    console.error("App type is NaN");
    console.log("Use help argument to list available options");
    process.exit(1);
  }
  createApp(type as unknown, path);
}

function help() {
  console.log(
    "First argument is an optional path to the directory where the app should be created"
  );
  console.log(
    "Second argument needs the first one, and is a number that specifies the app type to create"
  );
  console.log("Use list argument to list all available app types");
  process.exit(0);
}

if (args[2] === "help") help();
else if (args[2] === "list") {
  listApps(APPS, false);
  process.exit(0);
} else if (args[3] != null) autoRun(args[2], args[3]);
else main(args[2]);

function listApps(apps: Array<App>, listNumbers: boolean = true) {
  let index = 0;
  const indexesArray: Array<number> = [];

  apps.forEach((app) => {
    console.log(app.color, ` ${index}: ${app.name}`);
    indexesArray.push(index);
    index++;
  });
  console.log("\x1b[37m");
  if (listNumbers) console.log("[", ...indexesArray, "]");
}

function getInput(int: readline.Interface) {
  return new Promise((resolve, reject) => {
    int.question("Enter your answer: ", (answer) => {
      resolve(answer);
      int.close();
    });
  });
}

function doNothing(...vars: any) {}
