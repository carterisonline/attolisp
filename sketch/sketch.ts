//! import module = require('p5');
//! import * as p5Global from 'p5/global'
//! import * as p5 from 'p5'

// A symbol, sometimes called an identifier
type AtSymbol = string;

// A literal number
type AtNumber = number;

// Any literal value
type AtAtom = AtSymbol | AtNumber;

// An array of literals
type AtList<T> = T[];

// Any data, at all; called an expression
type AtExp<T> = AtAtom | AtList<T>;

// Tokenize the program on the simplest level; the first step.
function tokenize(chars: string): string[] {
  return chars
    .replace(/\(/g, " ( ") //   Add whitespace to parenthesis so that they can be
    .replace(/\)/g, " ) ") //   easily parsed by the `read_from_tokens()` stage.
    .split(/\s+/g) // Treat any length of whitespace as a separator.
    .filter((c) => c !== ""); // Filter out empty instructions
}

// Function for dealing with basic primitives
function atom(token: string): AtAtom {
  // Attempt to parse this as an integer
  const int = parseInt(token, 10);

  //                Fix for old EMCAStript parseInt() handling
  //                 |                         |
  //                 v                         v
  if (isNaN(int) || (int === 0 && token !== '0')) {
    // Not an integer? Let's try a float.
    const float = parseFloat(token);
    if (isNaN(float)) {
      // None of the above? Just return a string.
      return token;
    }
    return float;
  }
  return int;
}

// Function responsible for parsing the tokens into actual data
function read_from_tokens(tokens: string[]): any {
  //   Since `read_from_tokens()` is recursive, each pair of parenthesis are treated as their
  //   own "program," and while doing such, any unexpected EOF (end-of-file) will be treated as
  //   a parser error. This can also happen when the function is passed an empty list of instructions.
  if (tokens.length === 0) {
    throw new Error("You missed a parenthesis, or your program is empty!");
  }
  const token = tokens.shift(); // Pop off item from the front of `tokens`
  if (token === "(") { // Parse a pair of parenthesis
    let subpair = [];
    while (tokens[0] !== ")") { // Munch through all of the instructions inside 🤤
      subpair.push(read_from_tokens(tokens));
    }
    tokens.shift(); // Pop off the last closing parenthesis
    return subpair;
  } else if (token === ")") { // GRRR! HOW MANY TIMES TO I HAVE TO TELL YOU THIS ⁉️
    throw new Error("Unexpected ')'!");
  } else {
    return atom(token); // Just return a literal is there's no subpair.
  }
}

function parse(program: string): AtExp<string> {
  return read_from_tokens(tokenize(program));
}

// Default environment (the Env class is located at Env.ts)
let global_env: Env;

function eval_a(x: AtExp<string>, env: Env = global_env): any {
  if (typeof x === "string") {
    // Return function if argument passed is a string (not a literal)
    return env.data[x];
  } else if (typeof x === "number") {
    // You don't have to do anything with numbers
    return x;
  } else if (x[0] === "if") {
    // Run second argument if the first argument is true, else, run the third.
    const [_, test, conseq, alt] = x;
    const exp = eval_a(test, env) === true ? conseq : alt;
    return eval_a(exp, env);
  } else if (x[0] === "define") {
    // Add a function to the environment, persisting only for the scope it's in.
    const [_, symbol, exp] = x;
    env.data[symbol] = eval_a(exp, env);
  } else {
    // If `x` is an array/object, then we have to run a subpair as a function!
    const proc: Function = eval_a(x[0], env); // What function are we using?
    x.shift(); // Pop the instruction from the subpair
    return proc(x); // Run the function with the arguments!
  }
}

function setup() {
  let program = "(* 2 2 2 3)";

  console.log(`Your input: ${program}`);

  global_env = Env.default();

  console.log("Global environment / core library:");
  console.log(global_env);

  let out = eval_a(parse(program));

  console.log(`Your output: ${out}`);

  // Placeholder canvas stuff
  createCanvas(600, 600);
  background(0);
  textFont("Inter-Bold");
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(255);
  text("While there's nothing here yet, you feel a certain sense of unease. You may never know when Attolisp will advance to the canvas.", 50, 0, width - 100, height);
  textSize(15);
  text("(hint: check the console to see some activity)", width / 2, height * (3/4));
}
