enum Type {
  String,
  Number,
  Boolean,
  Expression,
  None,
}

interface Typed<T> {
  value: T,
  type: Type,
}

interface IsString {
  value: string,
  is_string: boolean,
}

// Tokenize the program on the simplest level; the first step.
function tokenize(chars: string): IsString[] {
  let complete_part: IsString[] = []; // Complete separated program
  let word_part = ""; // The part of the string that we're parsing
  let in_string = false; // Are we in a string?
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === "'") {
      complete_part.push({
        value: word_part,
        is_string: in_string
      });
      in_string = !in_string;
      word_part = "";
    } else {
      word_part += chars[i];
      if (i === chars.length - 1) {
        complete_part.push({
          value: word_part,
          is_string: in_string
        });
      }
    }
  }

  complete_part = complete_part.map(p => {
    if (!p.is_string) {
      return {
        value: p.value.replace(/\(/g, " ( ").replace(/\)/g, " ) "),
        is_string: false,
      };
    }
    return p;
  });

  let out: IsString[] = [];
  for (let part of complete_part) {
    if (!part.is_string) {
      let v = part.value.split(' ');

      for (let p of v) {
        out.push({
          value: p,
          is_string: false,
        })
      }
    } else {
      out.push({
        value: part.value,
        is_string: true,
      });
    }
  }

  out = out.filter(c => c.value !== "");
  return out;
}

// Function for dealing with basic primitives
function atom(token: IsString): Typed<Atom> {
  if (token.is_string) {
    return {
      type: Type.String,
      value: token.value
    }
  }

  const float = parseFloat(token.value);
  if (!isNaN(float)) {
    return {
      type: Type.Number,
      value: float
    };
  }

  // Handle booleans
  if (token.value === "false") {
    return {
      type: Type.Boolean,
      value: false
    };
  }

  if (token.value === "true") {
    return {
      type: Type.Boolean,
      value: true
    };
  }

  if (token.value === "none") {
    return {
      type: Type.None,
      value: null
    };
  }

  // None of the above? Just return an Expression.
  return {
    type: Type.Expression,
    value: token.value
  };
}

// Function responsible for parsing the tokens into actual data
function read_from_tokens(tokens: IsString[]): any {
  //   Since `read_from_tokens()` is recursive, each pair of parenthesis are treated as their
  //   own "program," and while doing such, any unexpected EOF (end-of-file) will be treated as
  //   a parser error. This can also happen when the function is passed an empty list of instructions.
  if (tokens.length === 0) {
    throw new Error("You missed a parenthesis, or your program is empty!");
  }
  const token = tokens.shift(); // Pop off item from the front of `tokens`
  if (token.value === "(") {
    // Parse a pair of parenthesis
    let subpair = [];
    while (tokens[0].value !== ")") {
      // Munch through all of the instructions inside 🤤
      subpair.push(read_from_tokens(tokens));
    }
    tokens.shift(); // Pop off the last closing parenthesis
    return subpair;
  } else if (token.value === ")") {
    // GRRR! HOW MANY TIMES TO I HAVE TO TELL YOU THIS ⁉️
    throw new Error("Unexpected ')'!");
  } else {
    return atom(token); // Just return a literal is there's no subpair.
  }
}

function parse(program: string): any {
  return read_from_tokens(tokenize(program));
}
