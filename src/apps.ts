export interface App {
  index: number;
  name: string;
  color: color;
  function: string;
  arguments: Array<string>;
}

export type color =
  | "\x1b[0m"
  | "\x1b[30m"
  | "\x1b[31m"
  | "\x1b[32m"
  | "\x1b[33m"
  | "\x1b[34m"
  | "\x1b[35m"
  | "\x1b[36m"
  | "\x1b[37m";

const APPS: Array<App> = [
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

export default APPS;
