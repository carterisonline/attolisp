// Tokenize the program on the simplest level; the first step.
function tokenize(chars: string): string[] {
  return chars
    .replace(/\(/g, " ( ") //   Add whitespace to parenthesis so that they can be
    .replace(/\)/g, " ) ") //   easily parsed by the `read_from_tokens()` stage.
    .split(/\s+/g) // Treat any length of whitespace as a separator.
    .filter((c) => c !== ""); // Filter out empty instructions
}

// Function for dealing with basic primitives
function atom(token: string): string | boolean | number {
  const float = parseFloat(token);
  if (!isNaN(float)) {
    return float;
  }

  // Handle booleans
  if (token === "false") {
    return false;
  }

  if (token === "true") {
    return true;
  }

  if (token === "none") {
    return null;
  }

  // None of the above? Just return a string.
  return token;
}

// Function responsible for parsing the tokens into actual data
function read_from_tokens(tokens: string[]): any {
  //   Since `read_from_tokens()` is recursive, each pair of parenthesis are treated as their
  //   own "program," and while doing such, any unexpected EOF (end-of-file) will be treated as
  //   a parser error. This can also happen when the function is passed an empty list of instructions.
  if (tokens.length === 0) {
    throw new Error("You missed a parenthesis, or your program is empty!");
  }
  const token = tokens.shift(); // Pop off item from the front of `tokens`
  if (token === "(") {
    // Parse a pair of parenthesis
    let subpair = [];
    while (tokens[0] !== ")") {
      // Munch through all of the instructions inside 🤤
      subpair.push(read_from_tokens(tokens));
    }
    tokens.shift(); // Pop off the last closing parenthesis
    return subpair;
  } else if (token === ")") {
    // GRRR! HOW MANY TIMES TO I HAVE TO TELL YOU THIS ⁉️
    throw new Error("Unexpected ')'!");
  } else {
    return atom(token); // Just return a literal is there's no subpair.
  }
}

function parse(program: string): any {
  return read_from_tokens(tokenize(program));
}
