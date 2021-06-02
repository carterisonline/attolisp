//! import module = require('p5');
//! import * as p5Global from 'p5/global'
//! import * as p5 from 'p5'

// Default environment (the Env class is located at Env.ts)
let global_env: Env<DefaultProgramEnvironment>;

function eval_a(
  x: any,
  env: Env<DefaultProgramEnvironment> = global_env
): any {
  if (typeof x !== "object") {
    if (typeof x === 'string') {
      // Return function if argument passed is a string (not a literal)
      return env.data[x];
    } else if (typeof x === 'number' || typeof x === 'boolean') {
      // You don't have to do anything with numbers
      return x;
    }
  } else if ((x as string[])[0] === "if") {
    // Run second argument if the first argument is true, else, run the third.
    const [_, test, conseq, alt] = x as any[];
    const exp = (eval_a(test, env) as boolean) === true ? conseq : alt;
    return eval_a(exp, env);
  } else if ((x as string[])[0] === "define") {
    // Add a function to the environment, persisting only for the scope it's in.
    const [_, symbol, exp] = x as any[];
    env.data[symbol as string] = eval_a(exp, env);
    console.log(env);
  } else {
    // If `x` is an array/object, then we have to run a subpair as a function!
    const proc = eval_a((x as any[])[0], env); // What function are we using?

    if (typeof proc === "function") {
      let args = []; // Run the function with the arguments!
      for (let i = 1; i < (x as any[]).length; i++) {
        args.push(eval_a((x as any[])[i], env));
      }
      return proc(args);
    }
  }
}

function setup() {
  let program = "(begin (define r 10) (define ops (list pi r r)) (* 2 (atan (apply * ops))))"; // The higher `r` is, the closer to pi

  console.log(`Your input: ${program}`);
  console.log("Is tokenized into: ")

  global_env = Env.default();

  const parsed = parse(program);

  console.log(parsed);

  let out = eval_a(parsed);

  console.log("Your output:");
  console.log(out);

  // Placeholder canvas stuff
  createCanvas(600, 600);
  background(0);
  textFont("Inter-Bold");
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(255);
  text(
    "While there's nothing here yet, you feel a certain sense of unease. You may never know when Attolisp will advance to the canvas.",
    50,
    0,
    width - 100,
    height
  );
  textSize(15);
  text(
    "(hint: check the console to see some activity)",
    width / 2,
    height * (3 / 4)
  );
}

function draw() {  }