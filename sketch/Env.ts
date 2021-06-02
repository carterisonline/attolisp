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
      "+": (numbers: Atom<number>[]) => {
        let sum = numbers[0].val;
        for (let i = 1; i < numbers.length; i++) {
          sum += numbers[i].val;
        }
        return new Atom<number>(sum);
      },
      //   This serves as two functions, the subtraction and negation functions. If you pass
      //   only one literal, it'll negate it, while anything else will subtract from the first literal.
      // Note: This does not apply to negative literals such as `-1`, only function uses such as `(- 1)`.
      "-": (numbers: Atom<number>[]) => {
        let out = numbers[0].val;

        // Negate if only one argument is passed
        if (numbers.length === 1) {
          out = -out;
        }

        // Subtract every other argument, skipped if there's only one.
        for (let i = 1; i < numbers.length; i++) {
          out -= numbers[i].val;
        }
        return new Atom<number>(out);
      },
      // Multiplication! This will multiply every number together.
      "*": (numbers: Atom<number>[]) => {
        let product = numbers[0].val;
        for (let i = 1; i < numbers.length; i++) {
          product *= numbers[i].val;
        }
        return new Atom<number>(product);
      },
      // When provided with one argument, returns (1 / x)
      "/": (numbers: Atom<number>[]) => {
        let out = numbers[0].val;

        // Flip if only one argument is passed
        if (numbers.length === 1) {
          out = 1 / out;
        }

        // Divide every other argument, skipped if there's only one.
        for (let i = 1; i < numbers.length; i++) {
          out /= numbers[i].val;
        }
        return new Atom<number>(out);
      },
      // Returns true if all elements are in ascending order
      "<": (numbers: Atom<number>[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val <= comparator) {
            return new Atom<boolean>(false);
          }
        }

        return new Atom<boolean>(true);
      },
      // Returns true if all elements are in descending order
      ">": (numbers: Atom<number>[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val >= comparator) {
            return new Atom<boolean>(false);
          }
        }

        return new Atom<boolean>(true);
      },
      // Return true if all elements are non-decreasing
      "<=": (numbers: Atom<number>[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val < comparator) {
            return new Atom<boolean>(false);
          }
        }

        return new Atom<boolean>(true);
      },
      // Return true if all elements are non-increasing
      ">=": (numbers: Atom<number>[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val > comparator) {
            return new Atom<boolean>(false);
          }
        }

        return new Atom<boolean>(true);
      },
      // Return true if all elements are equal
      "=": (numbers: Atom<number>[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val !== comparator) {
            return new Atom<boolean>(false);
          }
        }

        return new Atom<boolean>(true);
      },
      "abs": (vals: Atom<number>[]) => new Atom<number>(abs(vals[0].val)),
      "begin": (vals: Atom<any>[]) => vals[vals.length - 1], // Runs every first argument, and only returning the last one.
      "car": (vals: any[]) => new Atom<any>(vals[0].val[0]), // Returns the first item in a list
       // Returns the tail of a list
      "cdr": (vals: any[]) => {
        let out = vals[0].val;
        out.shift();
        return new Atom<any[]>(out);
      },
      "cons": (vals: any[]) => new Atom<any[]>([vals[0].val].concat(vals[1].val)), // Combines the `car` $1 and `cdr` $2 together
      // Return true if all elements are equal
      "eq?": (vals: any[]) => {
        let comparator = vals[0].val;

        for (let i = 1; i < vals.length; i++) {
          if (vals[i].val !== comparator) {
            return new Atom<boolean>(false);
          }
        }

        return new Atom<boolean>(true);
      },
      "expt": (numbers: Atom<number>[]) => new Atom<number>(pow(numbers[0].val, numbers[1].val)),
      // Prints each argument
      "println": (vals: Atom<any>[]): null => {
        if (vals.length > 1) {
          let out: any[] = [];
          for (let v of vals) {
            if (typeof v.val === "number" || typeof v.val === "boolean") {
              out.push(v.val);
            }
          }
          console.log(out);
        } else {
          console.log(vals[0].val);
        }
        return null;
      }
    };

    return out;
  }
}
