//! import module = require('p5');
//! import * as p5Global from 'p5/global'
//! import * as p5 from 'p5'

// Default environment (the Env class is located at Env.ts)
let global_env: Env<DefaultProgramEnvironment>;

function eval_a(
  item: Typed<Atom>[] | Typed<Atom>,
  env: Env<DefaultProgramEnvironment> = global_env
): any {
  if (!Array.isArray(item)) { // Is this not an array? (an object that indexes with numbers, not a Typed object)
    if ((item as Typed<Atom>).type === Type.Expression) {
      // Return function if argument passed is a string (not a literal)
      return env.data[(item as Typed<string>).value];
    } else {
      // You don't have to do anything with numbers
      return item;
    }
  } else if (item[0].value === "if") {
    // Run second argument if the first argument is true, else, run the third.
    const [_, test, conseq, alt] = item as Typed<Atom>[];
    let exp: Typed<Atom>;

    // fix for test "If true"
    if (eq(test, { type: Type.Boolean, value: true })) {
      exp = conseq;
    } else if (eq(test, { type: Type.Boolean, value: false })) {
      exp = alt;
    } else {
      // fix for test "If true (parsed)"
      exp = (eval_a(test, env)).value === true ? conseq : alt;
    }
    return eval_a(exp, env);
  } else if (item[0].value === "define") {
    // Add a function to the environment, persisting only for the scope it's in.
    const [_, symbol, exp] = item as Typed<Atom>[];
    env.data[symbol.value as string] = eval_a(exp, env);
  } else {
    // If `x` is an array/object, then we have to run a subpair as a function!
    const proc = eval_a((item as Typed<Atom>[])[0], env); // What function are we using?

    if (typeof proc === "function") {
      let args = []; // Run the function with the arguments!
      for (let i = 1; i < (item as Typed<Atom>[]).length; i++) {
        args.push(eval_a((item as Typed<Atom>[])[i], env));
      }
      return proc(args);
    }
  }
}

function setup() {
  run_tests();
  let program = "(not false)"; // The higher `r` is, the closer to pi

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

function draw() { }