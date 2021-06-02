// Program environment, responsible for handling functions
class Env {
  data: any;
  constructor() {
    this.data = {};
  }
  static default(): Env {
    // Default environment, almost like a "core" library.
    let out = new Env();

    out.data = {
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
      "abs": (vals: number[]) => abs(vals[0]),
      "begin": (vals: any[]) => vals[vals.length - 1], // Runs every first argument, and only returning the last one.
      "car": (vals: any[]) => vals[0][0], // Returns the first item in a list
       // Returns the tail of a list
      "cdr": (vals: any[]) => {
        let out = vals[0];
        out.shift();
        return new out;
      },
      "cons": (vals: any[]) => [vals[0]].concat(vals[1]), // Combines the `car` $1 and `cdr` $2 together
      // Return true if all elements are equal
      "eq?": (vals: any[]) => {
        let comparator = vals[0];

        for (let i = 1; i < vals.length; i++) {
          if (vals[i] !== comparator) {
            return false;
          }
        }

        return true;
      },
      "expt": (numbers: number[]) => pow(numbers[0], numbers[1]),
      // Prints each argument
      "println": (vals: any[]): null => {
        if (vals.length > 1) {
          let out: any[] = [];
          for (let v of vals) {
            if (typeof v === "number" || typeof v === "boolean") {
              out.push(v);
            }
          }
          console.log(out);
        } else {
          console.log(vals[0]);
        }
        return null;
      }
    };

    return out;
  }
}
