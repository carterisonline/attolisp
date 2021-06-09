//! import module = require('p5');
//! import * as p5Global from 'p5/global'
//! import * as p5 from 'p5'

// Default environment (the Env class is located at Env.ts)
let global_env: Env<DefaultProgramEnvironment>;

interface Fns {
  [propertyName: string]: Typed<Atom>[]
}

let lambdas: Fns = {};

function replacevars(obj: any[], prefix: any, vals: any): any[] {
  obj = obj.map(v => {
    try {
      if ((v.value as string).startsWith(prefix)) {
        return vals[parseInt((v.value as string).substring(3))];
      } else {
        return v;
      }
    } catch (_) {
      if (Array.isArray(v)) {
        v = replacevars(v, prefix, vals);
      }
      return v;
    }
  })

  return obj;
}

function find_and_replace(obj: (Typed<Atom> | Typed<Atom>[])[], find: any[]) {
  for (let i in obj) {
    if (Array.isArray(obj[i])) {
      (obj as any)[i] = find_and_replace((obj as Typed<Atom>[][])[i], find);
    } else {
      for (let j in find) {
        if ((obj as Typed<Atom>[])[i as any].value === (find as Typed<Atom>[])[j as any].value) {
          (obj as Typed<Atom>[])[i as any].value = `var${j}`
        }
      }
    }
  }

  return obj;
}

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
    // Add a value to the environment, persisting only for the scope it's in.
    const [_, symbol, exp] = item as Typed<Atom>[];
    env.data[symbol.value as string] = eval_a(exp, env);
  } else if (item[0].value === "set") {
    // Add a value to the environment, persisting for the entire program.
    const [_, symbol, exp] = item as Typed<Atom>[];
    global_env.data[symbol.value as string] = eval_a(exp, env);
  } else if (item[0].value === "function") {
    // Add a function to the environment, persisting for the entire program.
    let [_, name, args, fn] = item as (Typed<Atom> | Typed<Atom>[])[];
    fn = find_and_replace(fn as Typed<Atom>[], args as any) as Typed<Atom>[];
    lambdas[(name as Typed<string>).value] = fn as Typed<Atom>[];
    env.data[(name as Typed<string>).value] = function (vals: Typed<number>[]) {
      // I still have no idea how the name variable is still in scope here but it works like magic so I won't complain, javascript
      let lmb = lambdas[(name as Typed<string>).value];
      let l = replacevars(lmb, "var", vals);

      return eval_a(l, env);
    }
  } else {
    // If `x` is an array/object, then we have to run a subpair as a function!
    const proc = eval_a((item as Typed<Atom>[])[0], env); // What function are we using?

    if (typeof proc === "function") {
      let args = []; // Run the function with the arguments!
      for (let i = 1; i < (item as Typed<Atom>[]).length; i++) {
        args.push(eval_a((item as Typed<Atom>[])[i], global_env));
      }
      return proc(args);
    }
  }
}

function setup() {
  run_tests();
  let program = "(begin (function fact (n) (if (<= n 1) 1 (* n (fact (- n 1))))) (fact 10))"; // Factorial function!

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