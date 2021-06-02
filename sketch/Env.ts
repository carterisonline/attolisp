// Program environment, responsible for handling functions
type Atom = boolean | number | string;
type Expr = Atom | Atom[];

interface DefaultProgramEnvironment {
  [propertyName: string]: Function | Expr;
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
      "pi": PI,
      "tau": TAU,
      "e": exp(1),

      //! Function section ---------------
      // Adding! You can parse any number of arguments to add together, including just one!
      "+": (numbers: number[]) => {
        let sum = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
          sum += numbers[i];
        }
        return sum;
      },
      //   This serves as two functions, the subtraction and negation functions. If you pass
      //   only one literal, it'll negate it, while anything else will subtract from the first literal.
      // Note: This does not apply to negative literals such as `-1`, only function uses such as `(- 1)`.
      "-": (numbers: number[]) => {
        let out = numbers[0];

        // Negate if only one argument is passed
        if (numbers.length === 1) {
          out = -out;
        }

        // Subtract every other argument, skipped if there's only one.
        for (let i = 1; i < numbers.length; i++) {
          out -= numbers[i];
        }
        return out;
      },
      // Multiplication! This will multiply every number together.
      "*": (numbers: number[]) => {
        let product = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
          product *= numbers[i];
        }
        return product;
      },
      // When provided with one argument, returns (1 / x)
      "/": (numbers: number[]) => {
        let out = numbers[0];

        // Flip if only one argument is passed
        if (numbers.length === 1) {
          out = 1 / out;
        }

        // Divide every other argument, skipped if there's only one.
        for (let i = 1; i < numbers.length; i++) {
          out /= numbers[i];
        }
        return out;
      },
      // Returns true if all elements are in ascending order
      "<": (numbers: number[]) => {
        let comparator = numbers[0];

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i] <= comparator) {
            return false;
          }
        }

        return true;
      },
      // Returns true if all elements are in descending order
      ">": (numbers: number[]) => {
        let comparator = numbers[0];

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i] >= comparator) {
            return false;
          }
        }

        return true;
      },
      // Return true if all elements are non-decreasing
      "<=": (numbers: number[]) => {
        let comparator = numbers[0];

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i] < comparator) {
            return false;
          }
        }

        return true;
      },
      // Return true if all elements are non-increasing
      ">=": (numbers: number[]) => {
        let comparator = numbers[0];

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i] > comparator) {
            return false;
          }
        }

        return true;
      },
      // Return true if all elements are equal
      "=": (numbers: number[]) => {
        let comparator = numbers[0];

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i] !== comparator) {
            return false;
          }
        }

        return true;
      },
      "abs": (vals: number[]) => abs(vals[0]), // Returns the absolute value of the first element
      "acos": (numbers: number[]) => acos(numbers[0]), // Returns acos(n)
      "apply": (vals: (Expr | Function)[]) => (vals[0] as Function)(vals[1] as Atom[]), // Applies the operation to a list of elements
      "asin": (numbers: number[]) => asin(numbers[0]), // Returns asin(n)
      "atan": (numbers: number[]) => atan(numbers[0]), // Returns atan(n)
      "begin": (vals: Atom[]) => vals[vals.length - 1], // Runs every first argument, and only returning the last one.
      "car": (vals: Atom[][]) => vals[0][0], // Returns the first item in a list
      // Returns the tail of a list
      "cdr": (vals: any[]) => {
        let out = vals[0];
        out.shift();
        return out;
      },
      "cons": (vals: Atom[]) => [vals[0]].concat(vals[1]), // Combines the `car` $1 and `cdr` $2 together
      "cos": (numbers: number[]) => cos(numbers[0]), // Returns cos(n)
      // Return true if all elements are equal
      "eq?": (vals: Atom[]) => {
        let comparator = vals[0];

        for (let i = 1; i < vals.length; i++) {
          if (vals[i] !== comparator) {
            return false;
          }
        }

        return true;
      },
      "expt": (numbers: number[]) => pow(numbers[0], numbers[1]), // Raises the first number to the power of the second
      "length": (vals: Expr[]) => (vals[0] as Atom[]).length, // Returns length of first element
      "list": (vals: Atom[]) => vals, // Returns a list of the given elements
      "list?": (vals: Expr[]) => typeof vals[0] === "object", // Returns true if the first element is a list
      // Apply a mapping operation to any amount of lists
      "map": (vals: (Expr | Function)[]) => {
        let v: Atom[][] = [];
        for (let i = 1; i < vals.length; i++) {
          for (let j in vals[i] as Atom[]) {
            if (v[j] === undefined) {
              v[j] = [];
            }

            v[j][i - 1] = (vals[i] as Atom[])[j];
          }
        }
        return v.map(v => (vals[0] as Function)(v));
      },
      // Returns the maximum of any amount of numbers
      "max": (numbers: number[]) => {
        let m = -Infinity;
        for (let n of numbers) {
          m = max(m, n);
        }
        return m;
      },
      // Returns the minimum of any amount of numbers
      "min": (numbers: number[]) => {
        let m = Infinity;
        for (let n of numbers) {
          m = min(m, n);
        }
        return m;
      },
      "not": (bools: boolean[]) => bools.map(b => !b), // Inverts the values given
      "null?": (vals: Expr[]) => vals[0] === undefined || vals[0] === null || isNaN(vals[0] as number), // Returns true if the first element is null
      "number?": (vals: Expr[]) => typeof vals[0] === "number", // Returns true if the first element is a number
      "procedure?": (vals: (Function | Expr)[]) => typeof vals[0] === "function", // Returns true if the first element is a function
      // Prints each argument
      "println": (vals: Atom[]): null => {
        if (vals.length > 1) {
          let out: Atom[] = [];
          for (let v of vals) {
            if (typeof v === "number" || typeof v === "boolean" || typeof v === "string") {
              out.push(v);
            }
          }
          console.log(out);
        } else {
          console.log(vals[0]);
        }
        return null;
      },
      "round": (numbers: number[]) => numbers.map(n => round(n)), // Rounds any amount of numbers
      "sin": (numbers: number[]) => sin(numbers[0]), // Returns sin(n)
      "symbol?": (vals: Expr[]) => typeof vals[0] === "string", // Returns true if the first element is a string
      "tan": (numbers: number[]) => tan(numbers[0]), // Returns tan(n)
    });
  }
}
