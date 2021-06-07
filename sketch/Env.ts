// Program environment, responsible for handling functions
type Atom = boolean | number | string;
type Expr = Typed<Atom> | Typed<Atom>[];

interface DefaultProgramEnvironment {
  [propertyName: string]: Function | Expr;
}

function format(item: Expr): string {
  if (Array.isArray(item)) {
    return `[${item.map(i => i.value.toString()).join(', ')}]`
  } else {
    if (item.type === Type.Number || item.type === Type.Boolean) {
      return item.value.toString();
    } else if (item.type === Type.None) {
      return "None";
    } else if (item.type === Type.String) {
      return `'${item.value}'`;
    } else if (item.type === Type.Expression) {
      return `expr(${item.value})`;
    } else {
      return item.toString();
    }
  }
}

class Env<T> {
  data: T;
  constructor(data: T) {
    this.data = data;
  }
  static default(): Env<DefaultProgramEnvironment> {
    // Default environment, almost like a "core" library.
    return new Env({
      //! Global section -----------------
      "pi": { value: PI, type: Type.Number },
      "tau": { value: TAU, type: Type.Number },
      "e": { value: exp(1), type: Type.Number },

      //! Function section ---------------
      // Adding! You can parse any number of arguments to add together, including just one!
      "+": (numbers: Typed<number>[]) => {
        let sum = numbers[0].value;
        for (let i = 1; i < numbers.length; i++) {
          sum += numbers[i].value;
        }
        return {
          value: sum,
          type: Type.Number
        };
      },
      //   This serves as two functions, the subtraction and negation functions. If you pass
      //   only one literal, it'll negate it, while anything else will subtract from the first literal.
      // Note: This does not apply to negative literals such as `-1`, only function uses such as `(- 1)`.
      "-": (numbers: Typed<number>[]) => {
        let out = numbers[0].value;

        // Negate if only one argument is passed
        if (numbers.length === 1) {
          out = -out;
        }

        // Subtract every other argument, skipped if there's only one.
        for (let i = 1; i < numbers.length; i++) {
          out -= numbers[i].value;
        }
        return {
          value: out,
          type: Type.Number
        };
      },
      // Multiplication! This will multiply every number together.
      "*": (numbers: Typed<number>[]) => {
        let product = numbers[0].value;
        for (let i = 1; i < numbers.length; i++) {
          product *= numbers[i].value;
        }
        return {
          value: product,
          type: Type.Number
        };
      },
      // When provided with one argument, returns (1 / x)
      "/": (numbers: Typed<number>[]) => {
        let out = numbers[0].value;

        // Flip if only one argument is passed
        if (numbers.length === 1) {
          out = 1 / out;
        }

        // Divide every other argument, skipped if there's only one.
        for (let i = 1; i < numbers.length; i++) {
          out /= numbers[i].value;
        }
        return {
          value: out,
          type: Type.Number
        };
      },
      // Returns true if all elements are in ascending order
      "<": (numbers: Typed<number>[]) => {
        let comparator = numbers[0].value;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].value <= comparator) {
            return {
              value: false,
              type: Type.Boolean
            };
          }
        }

        return {
          value: true,
          type: Type.Boolean
        };
      },
      // Returns true if all elements are in descending order
      ">": (numbers: Typed<number>[]) => {
        let comparator = numbers[0].value;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].value >= comparator) {
            return {
              value: false,
              type: Type.Boolean
            };
          }
        }

        return {
          value: true,
          type: Type.Boolean
        };
      },
      // Return true if all elements are non-decreasing
      "<=": (numbers: Typed<number>[]) => {
        let comparator = numbers[0].value;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].value < comparator) {
            return {
              value: false,
              type: Type.Boolean
            };
          }
        }

        return {
          value: true,
          type: Type.Boolean
        };
      },
      // Return true if all elements are non-increasing
      ">=": (numbers: Typed<number>[]) => {
        let comparator = numbers[0].value;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].value > comparator) {
            return {
              value: false,
              type: Type.Boolean
            };
          }
        }

        return {
          value: true,
          type: Type.Boolean
        };
      },
      // Return true if all elements are equal
      "=": (numbers: Typed<number>[]) => {
        let comparator = numbers[0].value;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].value !== comparator) {
            return {
              value: false,
              type: Type.Boolean
            };
          }
        }

        return {
          value: true,
          type: Type.Boolean
        };
      },
      "abs": (vals: Typed<number>[]) => {
        return {
          value: abs(vals[0].value), type: Type.Number
        }
      }, // Returns the absolute value of the first element
      "acos": (vals: Typed<number>[]) => {
        return {
          value: acos(vals[0].value), type: Type.Number
        }
      }, // Returns acos(n)
      "apply": (vals: (Expr | Function)[]) => (vals[0] as Function)(vals[1] as Typed<Atom>[]), // Applies the operation to a list of elements
      "asin": (vals: Typed<number>[]) => {
        return {
          value: asin(vals[0].value), type: Type.Number
        }
      }, // Returns asin(n)
      "atan": (vals: Typed<number>[]) => {
        return {
          value: atan(vals[0].value), type: Type.Number
        }
      }, // Returns atan(n)
      "attach": (vals: Typed<Atom>[]) => [vals[0]].concat(vals[1]), // Combines the `car` $1 and `cdr` $2 together
      "begin": (vals: Typed<Atom>[]) => vals[vals.length - 1], // Runs every first argument, and only returning the last one.
      "cos": (vals: Typed<number>[]) => {
        return {
          value: cos(vals[0].value), type: Type.Number
        }
      }, // Returns cos(n)
      // Return true if all elements are equal
      "eq?": (vals: Typed<Atom>[]) => {
        let comparator = vals[0].value;

        for (let i = 1; i < vals.length; i++) {
          if (vals[i].value !== comparator) {
            return {
              value: false,
              type: Type.Boolean
            };
          }
        }

        return {
          value: true,
          type: Type.Boolean
        };
      },
      "exp": (numbers: Typed<number>[]) => {
        return {
          value: pow(numbers[0].value, numbers[1].value),
          type: Type.Number
        };
      }, // Raises the first number to the power of the second
      "function?": (vals: (Function | Expr)[]) => {
        return {
          value: typeof vals[0] === "function",
          type: Type.Boolean
        }
      }, // Returns true if the first element is a function
      "head": (vals: Typed<Atom>[][]) => vals[0][0], // Returns the first item in a list
      "length": (vals: Expr[]) => {
        return {
          value: (vals[0] as Typed<Atom>[]).length,
          type: Type.Number
        }
      }, // Returns length of first element
      "list": (vals: Typed<Atom>[]) => vals, // Returns a list of the given elements
      "list?": (vals: Expr[]) => {
        return {
          value: Array.isArray(vals[0]),
          type: Type.Boolean
        }
      }, // Returns true if the first element is a list
      // Apply a mapping operation to any amount of lists
      "map": (vals: (Expr | Function)[]) => {
        let v: Typed<Atom>[][] = [];
        for (let i = 1; i < vals.length; i++) {
          for (let j in vals[i] as Typed<Atom>[]) {
            if (v[j] === undefined) {
              v[j] = [];
            }

            v[j][i - 1] = (vals[i] as Typed<Atom>[])[j];
          }
        }
        return v.map(v => (vals[0] as Function)(v));
      },
      // Returns the maximum of any amount of numbers
      "max": (numbers: Typed<number>[]) => {
        let m = -Infinity;
        for (let n of numbers) {
          m = max(m, n.value);
        }
        return {
          value: m,
          type: Type.Number
        }
      },
      // Returns the minimum of any amount of numbers
      "min": (numbers: Typed<number>[]) => {
        let m = Infinity;
        for (let n of numbers) {
          m = min(m, n.value);
        }
        return {
          value: m,
          type: Type.Number
        }
      },
      "not": (bools: Typed<boolean>[]) => {
        return {
          value: !bools[0].value,
          type: Type.Boolean
        }
      }, // Inverts the values given
      "none?": (vals: Expr[]) => {
        return {
          value: (vals[0] as Typed<Atom>).type === Type.None,
          type: Type.Boolean
        }
      }, // Returns true if the first element is null
      "number?": (vals: Expr[]) => {
        return {
          value: (vals[0] as Typed<Atom>).type === Type.Number,
          type: Type.Boolean
        }
      }, // Returns true if the first element is a number
      "only": (vals: Expr[]) => {
        return vals[0]
      }, // Returns the first value
      // Prints each argument
      "println": (vals: Typed<Atom>[]) => {
        if (vals.length > 1) {
          let out: string[] = [];
          for (let v of vals) {
            out.push(format(v));
          }
          console.log(out);
        } else {
          console.log(format(vals[0]));
        }
        return {
          value: null,
          type: Type.None,
        };
      },
      "round": (numbers: Typed<number>[]) => {
        return {
          value: round(numbers[0].value),
          type: Type.Number
        }
      }, // Rounds any amount of numbers
      "sin": (vals: Typed<number>[]) => {
        return {
          value: sin(vals[0].value), type: Type.Number
        }
      }, // Returns sin(n)
      "string?": (vals: Expr[]) => {
        return {
          value: (vals[0] as Typed<Atom>).type === Type.String,
          type: Type.Boolean
        }
      }, // Returns true if the first element is a string
      // Returns the tail of a list
      "tail": (vals: any[]) => {
        let out = vals[0];
        out.shift();
        return out;
      },
      "tan": (vals: Typed<number>[]) => {
        return {
          value: tan(vals[0].value), type: Type.Number
        }
      }, // Returns tan(n)
    });
  }
}
