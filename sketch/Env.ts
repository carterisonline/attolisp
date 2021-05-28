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
        console.log(numbers);
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
    };

    return out;
  }
}
