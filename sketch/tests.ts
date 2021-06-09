interface TestOutput {
  ok: boolean,
  msg?: any[],
}

// Special thanks to https://stackoverflow.com/users/257182/robg for the eq and getClass functions

function getClass(obj: any) {
  return Object.prototype.toString.call(obj);
}

function eq(a: any, b: any): any {
  if (a === b) return true;
  if (typeof a != typeof b) return false;
  if (typeof a == 'number' && isNaN(a) && isNaN(b)) return true;
  var aClass = getClass(a);
  var bClass = getClass(b)
  if (aClass != bClass) return false;
  if (aClass == '[object Boolean]' || aClass == '[object String]' || aClass == '[object Number]') {
    return a.valueOf() == b.valueOf();
  }

  if (aClass == '[object RegExp]' || aClass == '[object Date]' || aClass == '[object Error]') {
    return a.toString() == b.toString();
  }

  if (typeof a == 'object' || typeof a == 'function') {
    if (aClass == '[object Function]' && a.toString() != b.toString()) return false;
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length != bKeys.length) return false;
    if (!aKeys.every(function (key) { return b.hasOwnProperty(key) })) return false;
    return aKeys.every(function (key) {
      return eq(a[key], b[key])
    });
  }
  return false;
}

function resultoutput(msg: string, one: any, other: any): any[] {
  if (typeof one !== "object" && typeof one !== "function" && (typeof other === "object" || typeof other === "function")) {
    msg += ` ${one} and 🡧`;
    return [msg, other];
  }

  if (typeof one !== "object" && typeof one !== "function" && typeof other !== "object" && typeof other !== "function") {
    msg += ` ${one} and ${other}.`;
    return [msg];
  }

  return [msg, one, other];
}

const color_testannouncement = "background: #555"
const color_ok = "background: green; color: black;"
const color_err = "background: red; color: black;"

function testcase(name: string, when: TestOutput) {
  let shoutout = when.ok ? " Passed" : " Failed";
  let clr = when.ok ? color_ok : color_err;
  console.log(`%c Test "${name}": %c${shoutout} `, color_testannouncement, clr);
  if (when.msg) {
    for (let l of when.msg) {
      console.log(l);
    }
  }
}

function assert_eq(given: any, expected: any): TestOutput {
  if (given === expected) return {
    ok: true,
  }

  else if (eq(given, expected)) return {
    ok: true,
  }

  else return {
    ok: false,
    msg: resultoutput("The following are supposed to be equal:", given, expected)
  }
}

function assert_neq(given: any, expected: any): TestOutput {
  let out = assert_eq(given, expected);
  return {
    ok: !out.ok,
    msg: out.msg ? undefined : resultoutput("The following are not supposed to be equal:", given, expected)
  }
}

function assert_program_eq(given: string, expected: any): TestOutput {
  global_env = Env.default();
  return assert_eq(eval_a(parse(given)), expected);
}

function assert_program_neq(given: string, expected: any): TestOutput {
  global_env = Env.default();
  return assert_neq(eval_a(parse(given)), expected);
}

function run_tests() {
  testcase("Not true is false", assert_program_eq("(not true)", {
    value: false,
    type: Type.Boolean
  }));

  testcase("Constants are fine", assert_program_eq("(only pi)", {
    value: PI,
    type: Type.Number
  }));

  testcase("Simple adding", assert_program_eq("(+ 1 2 3)", {
    value: 6,
    type: Type.Number
  }));

  testcase("Negate", assert_program_eq("(- 13.37)", {
    value: -13.37,
    type: Type.Number
  }));

  testcase("Simple subtraction", assert_program_eq("(- 10 2 3)", {
    value: 5,
    type: Type.Number
  }));

  testcase("Simple multiplication", assert_program_eq("(* 9 2 1)", {
    value: 18,
    type: Type.Number
  }));

  testcase("Reciprocal", assert_program_eq("(/ 10)", {
    value: 0.1,
    type: Type.Number
  }));

  testcase("Simple division", assert_program_eq("(/ 5 2)", {
    value: 2.5,
    type: Type.Number
  }));

  testcase("Values are increasing", assert_program_eq("(< 1 2 3)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Values are decreasing ", assert_program_eq("(> 3 2 1)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Values are non-decreasing", assert_program_eq("(<= 10 10 11)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Values are non-increasing", assert_program_eq("(>= 11 11 10)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("All values are equal", assert_program_eq("(= 1 1 1)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Values are not equal", assert_program_eq("(not (= 1 2 3))", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Absolute value", assert_program_eq("(abs -10)", {
    value: 10,
    type: Type.Number
  }));

  // Remember your unit circle, kids!

  testcase("arcCos", assert_program_eq("(acos (/ (sqrt 3) 2))", {
    value: PI / 6 + 0.0000000000000001, // Thank you, floating point numbers.
    type: Type.Number
  }));

  testcase("Apply arguments", assert_program_eq("(apply + (list 5 2 1))", {
    value: 8,
    type: Type.Number
  }));

  testcase("arcSin", assert_program_eq("(asin 1)", {
    value: PI / 2,
    type: Type.Number
  }))

  testcase("arcTan", assert_program_eq("(atan 1)", {
    value: PI / 4,
    type: Type.Number
  }))

  testcase("Attach head to tail", assert_program_eq("(attach 1 (list 2 3))", [{
    value: 1,
    type: Type.Number
  }, {
    value: 2,
    type: Type.Number
  }, {
    value: 3,
    type: Type.Number
  }]));

  testcase("Begin structure", assert_program_eq("(begin (only true) (only false))", {
    value: false,
    type: Type.Boolean
  }));

  testcase("Cosine", assert_program_eq("(cos (/ (* 5 pi) 6))", {
    value: -sqrt(3) / 2 - 0.0000000000000001, // >:(
    type: Type.Number
  }));

  testcase("Eq", assert_program_eq("(eq? false false)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Exponents", assert_program_eq("(exp 2 5)", {
    value: 32,
    type: Type.Number
  }));

  testcase("Method is a function", assert_program_eq("(function? +)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Floor number", assert_program_eq("(floor 12.51)", {
    value: 12,
    type: Type.Number
  }));

  testcase("Head of a list", assert_program_eq("(head (list 4 5 6))", {
    value: 4,
    type: Type.Number
  }));

  testcase("Length of a list", assert_program_eq("(length (list 9 0 2 1 0))", {
    value: 5,
    type: Type.Number
  }));

  testcase("List is a list", assert_program_eq("(list? (list 1 2 3))", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Map addition operation", assert_program_eq("(map + (list 3 7 2 1) (list 8 6 1))", [{
    value: 11,
    type: Type.Number
  }, {
    value: 13,
    type: Type.Number
  }, {
    value: 3,
    type: Type.Number
  }, {
    value: 1,
    type: Type.Number
  }]));

  //! babby's first issue!
  testcase("Map addition operation (backwards)", assert_program_eq("(map + (list 3 7 2) (list 8 6 1 1))", [{
    value: 11,
    type: Type.Number
  }, {
    value: 13,
    type: Type.Number
  }, {
    value: 3,
    type: Type.Number
  }, {
    value: 1,
    type: Type.Number
  }]));

  testcase("Maximum value", assert_program_eq("(max 8 1 5)", {
    value: 8,
    type: Type.Number
  }));

  testcase("Minimum value", assert_program_eq("(min 8 1 5)", {
    value: 1,
    type: Type.Number
  }));

  testcase("None is none", assert_program_eq("(none? none)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Float is a number", assert_program_eq("(number? 17.67)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Integer is a number", assert_program_eq("(number? 100)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Weird floats are still numbers", assert_program_eq("(number? 0.)", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Number in a string is not a number", assert_program_eq("(number? '100')", {
    value: false,
    type: Type.Boolean
  }));

  testcase("Round number", assert_program_eq("(round 12.5)", {
    value: 13,
    type: Type.Number
  }));

  testcase("Sine", assert_program_eq("(sin 0)", {
    value: 0,
    type: Type.Number
  }))

  testcase("String is a string", assert_program_eq("(string? 'Hello, world!')", {
    value: true,
    type: Type.Boolean
  }));

  testcase("Spaces in a string are not argseps", assert_program_eq("(length (list 'Hello, world!'))", {
    value: 1,
    type: Type.Number
  }));

  testcase("Literals are not strings", assert_program_eq("(string? println)", {
    value: false,
    type: Type.Boolean
  }));

  testcase("Square root", assert_program_eq("(sqrt 4)", {
    value: 2,
    type: Type.Number
  }));

  testcase("Tail of a list", assert_program_eq("(tail (list 1 2))", [{
    value: 2,
    type: Type.Number
  }]));

  testcase("Tangent", assert_program_eq("(tan (/ pi 4))", {
    value: 1 - 0.0000000000000001,
    type: Type.Number
  }));

  testcase("Simple definitions", assert_program_eq("(begin (define r 10) (only r))", {
    value: 10,
    type: Type.Number
  }));

  testcase("If true", assert_program_eq("(if true (only 5) (only 10))", {
    value: 5,
    type: Type.Number
  }));

  testcase("If false", assert_program_eq("(if false (only 5) (only 10))", {
    value: 10,
    type: Type.Number
  }));

  testcase("If true (parsed)", assert_program_eq("(if (= 1 1) (only 5) (only 10))", {
    value: 5,
    type: Type.Number
  }));

  testcase("If false (parsed)", assert_program_eq("(if (= 1 2) (only 5) (only 10))", {
    value: 10,
    type: Type.Number
  }));

  testcase("One-arg functions", assert_program_eq("(begin (function plusone (x) (+ x 1)) (plusone 1))", {
    value: 2,
    type: Type.Number
  }));

  testcase("Multiarg functions", assert_program_eq("(begin (function plusone (x y) (+ x y 1)) (plusone 4 5))", {
    value: 10,
    type: Type.Number
  }));

  testcase("Advanced functions", assert_program_eq("(begin (function mod (x y) (- x (* y (floor (/ x y))))) (mod 20 7))", {
    value: 20 % 7,
    type: Type.Number
  }));

  testcase("No function collision (odd)", assert_program_eq("(begin (function plusone (x) (+ x 1)) (function plustwo (x) (+ x 2)) (plusone 1))", {
    value: 2,
    type: Type.Number
  }));

  testcase("No function collision (even)", assert_program_eq("(begin (function plusone (x) (+ x 1)) (function plustwo (x) (+ x 2)) (plustwo 1))", {
    value: 3,
    type: Type.Number
  }));

  testcase("Recursive functions", assert_program_eq("(begin (function fact (n) (if (<= n 1) 1 (* n (fact (- n 1))))) (fact 10))", {
    value: 3628800,
    type: Type.Number
  }));

  testcase("List-generative functions", assert_program_eq("(begin (function range (a b) (if (= a b) a (attach a (range (+ a 1) b)))) (range 0 4))", [
    { value: 0, type: Type.Number },
    { value: 1, type: Type.Number },
    { value: 2, type: Type.Number },
    { value: 3, type: Type.Number },
    { value: 4, type: Type.Number },
  ]))
}