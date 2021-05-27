// Program environment, responsible for handling functions
class Env {
  data: any;
  constructor() {
    this.data = {};
  }
  static default(): Env { // Default environment, almost like a "core" library.
    let out = new Env();

    //   A quick note here: When `eval_a()` calls one of these functions, they'll be called
    //   with a variable amount of arguments. By default, literals are stored in their own
    //   single-capacity arrays for compatibility with lambdas, complex equations, etc.
    //   As a result of this, you'll see `args[0]` or `numbers[0]` being used a lot. Just think
    //   of this as the place where all literals are stored.
    out.data = {
      // Adding! You can parse any number of arguments to add together, including just one!
      "+": (...numbers: any[]) => {
        let sum = numbers[0][0];
        for (let i = 1; i < numbers[0].length; i++) {
          sum += numbers[0][i];
        }
        return sum;
      },
      //   This serves as two functions, the subtraction and negation functions. If you pass
      //   only one literal, it'll negate it, while anything else will subtract from the first literal.
      // Note: This does not apply to negative literals such as `-1`, only function uses such as `(- 1)`.
      '-': (...numbers: any[]) => {
        let out = numbers[0][0];

        // Negate if only one argument is passed
        if (numbers[0].length === 1) {
          out = -out
        }

        // Subtract every other argument, skipped if there's only one.
        for (let i = 1; i < numbers[0].length; i++) {
          out -= numbers[0][i];
        }
        return out
      },
      // Multiplication! This will multiply every number together.
      '*': (...numbers: any[]) => {
        let product = numbers[0][0];
        for (let i = 1; i < numbers[0].length; i++) {
          product *= numbers[0][i];
        }
        return product;
      }
    };

    return out;
  }
}