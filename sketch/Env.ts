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
      "+": (numbers: AtNum[]) => {
        let sum = numbers[0].val;
        for (let i = 1; i < numbers.length; i++) {
          sum += numbers[i].val;
        }
        return new AtNum(sum);
      },
      //   This serves as two functions, the subtraction and negation functions. If you pass
      //   only one literal, it'll negate it, while anything else will subtract from the first literal.
      // Note: This does not apply to negative literals such as `-1`, only function uses such as `(- 1)`.
      "-": (numbers: AtNum[]) => {
        let out = numbers[0].val;

        // Negate if only one argument is passed
        if (numbers.length === 1) {
          out = -out;
        }

        // Subtract every other argument, skipped if there's only one.
        for (let i = 1; i < numbers.length; i++) {
          out -= numbers[i].val;
        }
        return new AtNum(out);
      },
      // Multiplication! This will multiply every number together.
      "*": (numbers: AtNum[]) => {
        let product = numbers[0].val;
        for (let i = 1; i < numbers.length; i++) {
          product *= numbers[i].val;
        }
        return new AtNum(product);
      },
      // When provided with one argument, returns (1 / x)
      "/": (numbers: AtNum[]) => {
        let out = numbers[0].val;

        // Flip if only one argument is passed
        if (numbers.length === 1) {
          out = 1 / out;
        }

        // Divide every other argument, skipped if there's only one.
        for (let i = 1; i < numbers.length; i++) {
          out /= numbers[i].val;
        }
        return new AtNum(out);
      },
      // Returns true if all elements are in ascending order
      "<": (numbers: AtNum[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val <= comparator) {
            return new AtBool(false);
          }
        }

        return new AtBool(true);;
      },
      // Returns true if all elements are in descending order
      ">": (numbers: AtNum[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val >= comparator) {
            return new AtBool(false);
          }
        }

        return new AtBool(true);
      },
      // Return true if all elements are non-decreasing
      "<=": (numbers: AtNum[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val < comparator) {
            return new AtBool(false);
          }
        }

        return new AtBool(true);
      },
      // Return true if all elements are non-increasing
      ">=": (numbers: AtNum[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val > comparator) {
            return new AtBool(false);
          }
        }

        return new AtBool(true);
      },
      // Return true if all elements are equal
      "=": (numbers: AtNum[]) => {
        let comparator = numbers[0].val;

        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i].val !== comparator) {
            return new AtBool(false);
          }
        }

        return new AtBool(true);
      },
      "abs": (vals: AtNum[]) => new AtNum(abs(vals[0].val)),
      "begin": (vals: Atom<any>[]) => vals[vals.length - 1], // Runs every first argument, and only returning the last one.
      // Prints each argument
      "println": (vals: Atom<any>[]): null => {
        if (vals.length > 1) {
          let out = [];
          for (let v of vals) {
            if (v instanceof AtNum || v instanceof AtBool) {
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
