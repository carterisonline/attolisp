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
}