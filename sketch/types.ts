class Atom<T> {
  val: T;
  overrides() {}
  constructor(val: T) {
    this.val = val;
    this.overrides();
  }
}

class AtNum extends Atom<number> {
  isInt: boolean;
  overrides() {
    if (floor(this.val) === this.val) {
      this.isInt = true;
    } else {
      this.isInt = false;
    }
  }
}

class AtSymb extends Atom<string> {}
class AtBool extends Atom<boolean> {}
